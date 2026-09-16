import { NextResponse } from "next/server";
import { requireServerUser } from "@/lib/auth-session";
import { can } from "@/lib/permissions/rbac";
import { getWorkspaceAccess } from "@/features/workspace/platform-workspace-repository";
import { createDeterministicEmbeddingProvider, createHttpEmbeddingProvider } from "@/features/knowledge/embedding";
import { indexCanonicalMarkdown } from "@/features/knowledge/document-pipeline";
import { createPrismaKnowledgeIndex } from "@/features/knowledge/prisma-knowledge-index";
import { beginRagRebuild, clearRag, deleteRagChunks, listReadyKnowledgeSources, markRagFailed, markRagReady } from "@/features/knowledge/rag-repository";
import { ragDeleteSchema, ragRebuildSchema } from "@/zod/schemas/knowledge";

async function workspaceForAction(workspaceId: string, userId: string, message: string) {
  const access = await getWorkspaceAccess(workspaceId, userId);
  if (!access || !can(access.role, "workspace:update")) return { response: NextResponse.json({ message }, { status: 403 }) };
  return { workspaceId: access.workspaceId };
}

export async function POST(request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  const user = await requireServerUser();
  if (!user) return NextResponse.json({ message: "Autenticação necessária." }, { status: 401 });
  const { workspaceId } = await params;
  const authorized = await workspaceForAction(workspaceId, user.id, "Seu papel não permite recriar o RAG.");
  if ("response" in authorized) return authorized.response;
  const parsed = ragRebuildSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Confirme que deseja apagar o RAG atual e criar um novo." }, { status: 422 });
  const started = await beginRagRebuild({ workspaceId: authorized.workspaceId, userId: user.id });
  try {
    const sources = await listReadyKnowledgeSources(authorized.workspaceId);
    if (!sources.length) {
      const rag = await markRagReady({ workspaceId: authorized.workspaceId, status: "EMPTY", userId: user.id, action: "rebuild_empty" });
      return NextResponse.json({ rag, removedChunks: started.removedChunks, documents: 0, chunks: 0 });
    }
    const index = createPrismaKnowledgeIndex();
    const embedding = process.env.INFERENCE_GATEWAY_URL ? createHttpEmbeddingProvider() : createDeterministicEmbeddingProvider();
    let chunkCount = 0;
    for (const source of sources) {
      const indexed = await indexCanonicalMarkdown({ documentId: source.documentId, documentVersionId: source.id, workspaceId: authorized.workspaceId, sourceName: source.document.name, canonicalMarkdown: source.canonicalMarkdown ?? "", extractionConfidence: source.extractionConfidence ?? undefined, embeddingProvider: embedding, index });
      chunkCount += indexed.chunks.length;
    }
    const rag = await markRagReady({ workspaceId: authorized.workspaceId, status: "READY", userId: user.id, action: "rebuild_complete" });
    return NextResponse.json({ rag, removedChunks: started.removedChunks, documents: sources.length, chunks: chunkCount });
  } catch (error) {
    await deleteRagChunks(authorized.workspaceId);
    const message = error instanceof Error ? error.message : "O novo RAG não pôde ser criado.";
    const rag = await markRagFailed({ workspaceId: authorized.workspaceId, userId: user.id, message, action: "rebuild_failed" });
    return NextResponse.json({ message, rag, status: "FAILED" }, { status: 422 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  const user = await requireServerUser();
  if (!user) return NextResponse.json({ message: "Autenticação necessária." }, { status: 401 });
  const { workspaceId } = await params;
  const authorized = await workspaceForAction(workspaceId, user.id, "Seu papel não permite apagar o RAG.");
  if ("response" in authorized) return authorized.response;
  const parsed = ragDeleteSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Confirme que deseja apagar completamente o RAG." }, { status: 422 });
  const result = await clearRag({ workspaceId: authorized.workspaceId, userId: user.id });
  return NextResponse.json({ rag: result.rag, removedChunks: result.removedChunks });
}
