import { createHash } from "node:crypto";
import type { TraceContext } from "@/lib/platform/contracts";
import type { KnowledgeChunk, KnowledgeFormat } from "@/types/knowledge";
import { audioTrace, type AudioTranscriptionProvider, type TranscriptPolisher } from "./audio-transcription";
import type { DocumentConverter, DocumentConversionInput } from "./document-converters";
import { chunkMarkdown, detectKnowledgeFormat, isAudioFormat, normalizeTextToMarkdown, trace } from "./knowledge-domain";
import type { EmbeddingProvider } from "./embedding";
import type { KnowledgeIndex } from "./knowledge-retrieval";

export type DocumentPipelineInput = {
  documentId: string;
  documentVersionId: string;
  workspaceId: string;
  name: string;
  mimeType: string;
  bytes: Uint8Array;
  format?: KnowledgeFormat;
  extractionConfidence?: number;
  traceContext: TraceContext;
};

export type DocumentPipelineResult = {
  format: KnowledgeFormat;
  extractedText: string;
  canonicalMarkdown: string;
  derivedCsv?: string;
  extractionConfidence: number;
  chunks: KnowledgeChunk[];
  vectors: number[][];
  conversionTrace: ReturnType<typeof trace>[];
};

function checksum(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function indexCanonicalMarkdown(input: { documentId: string; documentVersionId: string; workspaceId: string; sourceName: string; canonicalMarkdown: string; extractionConfidence?: number; embeddingProvider: EmbeddingProvider; index: KnowledgeIndex }) {
  if (!input.canonicalMarkdown.trim()) throw new Error("O RAG só pode ser criado a partir de Markdown canônico confirmado.");
  const chunks = chunkMarkdown({ markdown: input.canonicalMarkdown, documentId: input.documentId, documentVersionId: input.documentVersionId, workspaceId: input.workspaceId, sourceName: input.sourceName, extractionConfidence: input.extractionConfidence }).map((chunk) => ({ ...chunk, checksum: checksum(chunk.content), permissions: { allowedWorkspaceIds: [input.workspaceId] } }));
  if (!chunks.length) throw new Error("O documento não produziu trechos para indexação; o RAG foi interrompido.");
  const vectors: number[][] = [];
  for (const chunk of chunks) {
    const embedding = await input.embeddingProvider.embed({ text: chunk.content, workspaceId: input.workspaceId });
    vectors.push(embedding.vector);
  }
  await input.index.index({ chunks, vectors });
  return { chunks, vectors, conversionTrace: [trace("chunk", "succeeded", { provider: "structural-chunker" }), trace("embed", "succeeded", { provider: "embedding-provider" }), trace("index", "succeeded", { provider: "pgvector" })] };
}

export async function runDocumentKnowledgePipeline(input: DocumentPipelineInput & {
  converter: DocumentConverter;
  embeddingProvider: EmbeddingProvider;
  index: KnowledgeIndex;
  transcriber?: AudioTranscriptionProvider;
  polisher?: TranscriptPolisher;
}): Promise<DocumentPipelineResult> {
  const format = input.format ?? detectKnowledgeFormat(input.name, input.mimeType);
  const conversionTrace: ReturnType<typeof trace>[] = [trace("validate", "succeeded", { provider: "knowledge-pipeline" })];
  let converted;
  if (isAudioFormat(format)) {
    if (!input.transcriber || !input.polisher) throw new Error("A transcrição de áudio precisa de Whisper e do InferenceGateway antes do RAG.");
    const transcribed = await input.transcriber.transcribe({ name: input.name, mimeType: input.mimeType, bytes: input.bytes, trace: input.traceContext });
    conversionTrace.push(audioTrace.transcribed(transcribed.provider, transcribed.model));
    const polished = await input.polisher.polish({ text: transcribed.text, trace: input.traceContext });
    conversionTrace.push(audioTrace.polished(polished.provider, polished.model, polished.reasoning));
    const canonicalMarkdown = normalizeTextToMarkdown(polished.text, `${input.name} — transcrição revisada`);
    converted = { format, extractedText: transcribed.text, canonicalMarkdown, extractionConfidence: 0.85, trace: [] as ReturnType<typeof trace>[] };
  } else {
    const conversionInput: DocumentConversionInput = { name: input.name, mimeType: input.mimeType, bytes: input.bytes, format };
    converted = await input.converter.convert(conversionInput);
    conversionTrace.push(...converted.trace);
  }
  if (!converted.canonicalMarkdown.trim()) throw new Error("O documento não produziu Markdown canônico; o RAG foi interrompido.");
  const indexed = await indexCanonicalMarkdown({ documentId: input.documentId, documentVersionId: input.documentVersionId, workspaceId: input.workspaceId, sourceName: input.name, canonicalMarkdown: converted.canonicalMarkdown, extractionConfidence: input.extractionConfidence ?? converted.extractionConfidence, embeddingProvider: input.embeddingProvider, index: input.index });
  conversionTrace.push(...indexed.conversionTrace);
  return { format, extractedText: converted.extractedText, canonicalMarkdown: converted.canonicalMarkdown, derivedCsv: converted.derivedCsv, extractionConfidence: converted.extractionConfidence, chunks: indexed.chunks, vectors: indexed.vectors, conversionTrace };
}
