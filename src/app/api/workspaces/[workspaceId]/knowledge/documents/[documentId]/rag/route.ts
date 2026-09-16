import { NextResponse } from "next/server";
import { requireServerUser } from "@/lib/auth-session";
import { can } from "@/lib/permissions/rbac";
import { getWorkspaceAccess } from "@/features/workspace/platform-workspace-repository";
import { createDeterministicEmbeddingProvider, createHttpEmbeddingProvider } from "@/features/knowledge/embedding";
import { indexCanonicalMarkdown } from "@/features/knowledge/document-pipeline";
import { createPrismaKnowledgeIndex } from "@/features/knowledge/prisma-knowledge-index";
import { beginRagDocumentReplacement, deleteDocumentRagChunks, getReadyKnowledgeSource, markRagReady, recordRagOperationFailure } from "@/features/knowledge/rag-repository";
import { ragDocumentReplaceSchema } from "@/zod/schemas/knowledge";

export async function POST(request: Request, { params }: { params: Promise<{ workspaceId: string; documentId: string }> }) {
  const user = await requireServerUser();
  if (!user) return NextResponse.json({ message: "Autenticação necessária." }, { status: 401 });
  const { workspaceId, documentId } = await params;
  const access = await getWorkspaceAccess(workspaceId, user.id);
  if (!access || !can(access.role, "workspace:update")) return NextResponse.json({ message: "Seu papel não permite substituir o RAG deste arquivo." }, { status: 403 });
  const parsed = ragDocumentReplaceSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Confirme que deseja substituir o RAG deste arquivo." }, { status: 422 });
  const source = await getReadyKnowledgeSource({ workspaceId: access.workspaceId, documentId });
  if (!source) return NextResponse.json({ message: "Este arquivo ainda não tem Markdown confirmado. Conclua a conversão antes de substituir o RAG." }, { status: 409 });
  const started = await beginRagDocumentReplacement({ workspaceId: access.workspaceId, userId: user.id, documentId });
  const index = createPrismaKnowledgeIndex();
  const embedding = process.env.INFERENCE_GATEWAY_URL ? createHttpEmbeddingProvider() : createDeterministicEmbeddingProvider();
  try {
    const indexed = await indexCanonicalMarkdown({ documentId: source.documentId, documentVersionId: source.id, workspaceId: access.workspaceId, sourceName: source.document.name, canonicalMarkdown: source.canonicalMarkdown ?? "", extractionConfidence: source.extractionConfidence ?? undefined, embeddingProvider: embedding, index });
    const rag = await markRagReady({ workspaceId: access.workspaceId, status: "READY", userId: user.id, action: "document_replace" });
    return NextResponse.json({ rag, documentId, versionId: source.id, removedChunks: started.removedChunks, chunks: indexed.chunks.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "O RAG deste arquivo não pôde ser substituído.";
    await deleteDocumentRagChunks({ workspaceId: access.workspaceId, documentId });
    const rag = await recordRagOperationFailure({ workspaceId: access.workspaceId, userId: user.id, message, action: "document_replace_failed" });
    return NextResponse.json({ message, rag, documentId, removedChunks: started.removedChunks, status: "FAILED" }, { status: 422 });
  }
}
