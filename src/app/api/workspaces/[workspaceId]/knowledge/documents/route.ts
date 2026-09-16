import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { requireServerUser } from "@/lib/auth-session";
import { can } from "@/lib/permissions/rbac";
import { getWorkspaceAccess } from "@/features/workspace/platform-workspace-repository";
import { createDocumentRecord, getDocumentStorageReference, removeDocumentRecord, saveDocumentStorageReference, saveDocumentVersionResult } from "@/features/knowledge/document-repository";
import { createOpenAiWhisperProvider, createTranscriptPolisher, AudioTranscriptionError } from "@/features/knowledge/audio-transcription";
import { createNodeDocumentConverter } from "@/features/knowledge/node-document-converters";
import { createDeterministicEmbeddingProvider, createHttpEmbeddingProvider } from "@/features/knowledge/embedding";
import { createHttpInferenceGateway } from "@/lib/platform/http-inference-gateway";
import { createInMemoryKnowledgeIndex } from "@/features/knowledge/knowledge-retrieval";
import { createPrismaKnowledgeIndex } from "@/features/knowledge/prisma-knowledge-index";
import { detectKnowledgeFormat, isAudioFormat, isSupportedKnowledgeFormat } from "@/features/knowledge/knowledge-domain";
import { runDocumentKnowledgePipeline } from "@/features/knowledge/document-pipeline";
import { createUploadThingAssetStorage, UploadThingStorageError } from "@/lib/platform/uploadthing-asset-storage";
import { getOrCreateRagIndex, markRagReady } from "@/features/knowledge/rag-repository";
import { documentMetadataSchema } from "@/zod/schemas/knowledge";

const maxDocumentBytes = 50 * 1024 * 1024;

function checksum(bytes: Uint8Array) {
  return `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
}

export async function POST(request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  const user = await requireServerUser();
  if (!user) return NextResponse.json({ message: "Autenticação necessária." }, { status: 401 });
  const { workspaceId } = await params;
  const access = await getWorkspaceAccess(workspaceId, user.id);
  if (!access || !can(access.role, "workspace:update")) return NextResponse.json({ message: "Seu papel não permite enviar arquivos." }, { status: 403 });
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ message: "Escolha um arquivo para continuar." }, { status: 422 });
  if (!file.size || file.size > maxDocumentBytes) return NextResponse.json({ message: "O arquivo precisa ter conteúdo e até 50 MB." }, { status: 422 });
  const bytes = new Uint8Array(await file.arrayBuffer());
  const format = detectKnowledgeFormat(file.name, file.type);
  if (!isSupportedKnowledgeFormat(format)) return NextResponse.json({ message: "Este formato não pode ser compreendido. Envie PDF, DOCX, XLSX, CSV, texto ou áudio." }, { status: 422 });
  const parsed = documentMetadataSchema.safeParse({ name: file.name, mimeType: file.type || "application/octet-stream", size: file.size, checksum: checksum(bytes), description: String(form?.get("description") || "") || undefined });
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Arquivo inválido." }, { status: 422 });
  const pendingOriginalKey = `pending/${access.workspaceId}/${parsed.data.checksum}/${file.name}`;
  const record = await createDocumentRecord({ workspaceId: access.workspaceId, name: file.name, mimeType: parsed.data.mimeType, format, size: parsed.data.size, checksum: parsed.data.checksum, origin: "UploadThing", description: parsed.data.description, originalKey: pendingOriginalKey });
  if (!record.version) return NextResponse.json({ documentId: record.document.id, status: record.document.processingStatus, deduplicated: true });
  try {
    const storage = createUploadThingAssetStorage();
    const stored = await storage.put({ workspaceId: access.workspaceId, assetId: record.document.id, bytes, contentType: parsed.data.mimeType });
    await saveDocumentStorageReference({ documentId: record.document.id, originalKey: stored.key, originalUrl: stored.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "O armazenamento do arquivo falhou.";
    await saveDocumentVersionResult({ documentId: record.document.id, versionId: record.version.id, status: "FAILED", errorCode: error instanceof UploadThingStorageError ? error.code : "UPLOADTHING_UPLOAD_FAILED", errorMessage: message });
    return NextResponse.json({ message, documentId: record.document.id, versionId: record.version.id, status: "FAILED" }, { status: 503 });
  }
  const base = { documentId: record.document.id, documentVersionId: record.version.id, workspaceId: access.workspaceId, name: file.name, mimeType: parsed.data.mimeType, bytes, format, traceContext: { traceId: crypto.randomUUID(), workspaceId: access.workspaceId, idempotencyKey: `knowledge:${record.version.id}` } };
  try {
    await getOrCreateRagIndex(access.workspaceId);
    const index = process.env.DATABASE_URL ? createPrismaKnowledgeIndex() : createInMemoryKnowledgeIndex();
    const embedding = process.env.INFERENCE_GATEWAY_URL ? createHttpEmbeddingProvider() : createDeterministicEmbeddingProvider();
    const pipeline = await runDocumentKnowledgePipeline({ ...base, converter: createNodeDocumentConverter(), embeddingProvider: embedding, index, ...(isAudioFormat(format) ? { transcriber: createOpenAiWhisperProvider(), polisher: createTranscriptPolisher(createHttpInferenceGateway()) } : {}) });
    const saved = await saveDocumentVersionResult({ documentId: record.document.id, versionId: record.version.id, status: "READY", extractedText: pipeline.extractedText, canonicalMarkdown: pipeline.canonicalMarkdown, derivedCsv: pipeline.derivedCsv, extractionConfidence: pipeline.extractionConfidence, conversionTrace: pipeline.conversionTrace as unknown as import("@prisma/client").Prisma.InputJsonValue });
    await markRagReady({ workspaceId: access.workspaceId, status: "READY", userId: user.id, action: "document_upload" });
    return NextResponse.json({ documentId: record.document.id, versionId: saved.id, status: saved.processingStatus, format, chunks: pipeline.chunks.length, storage: "UploadThing" }, { status: 201 });
  } catch (error) {
    if (error instanceof AudioTranscriptionError && error.waitingForUser) {
      await saveDocumentVersionResult({ documentId: record.document.id, versionId: record.version.id, status: "WAITING_USER", errorCode: error.code, errorMessage: error.message });
      return NextResponse.json({ documentId: record.document.id, versionId: record.version.id, status: "WAITING_USER", message: error.message }, { status: 202 });
    }
    const message = error instanceof Error ? error.message : "O processamento do arquivo falhou.";
    await saveDocumentVersionResult({ documentId: record.document.id, versionId: record.version.id, status: "FAILED", errorCode: "DOCUMENT_PIPELINE_FAILED", errorMessage: message });
    return NextResponse.json({ message, documentId: record.document.id, versionId: record.version.id, status: "FAILED" }, { status: 422 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  const user = await requireServerUser();
  if (!user) return NextResponse.json({ message: "Autenticação necessária." }, { status: 401 });
  const { workspaceId } = await params;
  const access = await getWorkspaceAccess(workspaceId, user.id);
  if (!access || !can(access.role, "workspace:update")) return NextResponse.json({ message: "Seu papel não permite remover arquivos." }, { status: 403 });
  const documentId = new URL(request.url).searchParams.get("documentId");
  if (!documentId) return NextResponse.json({ message: "Informe o arquivo que deve ser removido." }, { status: 422 });
  const document = await getDocumentStorageReference({ workspaceId: access.workspaceId, documentId });
  if (!document) return NextResponse.json({ message: "Arquivo não encontrado." }, { status: 404 });
  try {
    const storage = createUploadThingAssetStorage();
    await storage.remove({ workspaceId: access.workspaceId, assetId: document.id });
    await removeDocumentRecord({ workspaceId: access.workspaceId, documentId: document.id });
    return NextResponse.json({ documentId: document.id, status: "REVOKED" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível remover o arquivo do storage.";
    return NextResponse.json({ message, documentId: document.id, status: "FAILED" }, { status: 503 });
  }
}
