import { describe, expect, it, vi } from "vitest";
import type { InferenceGateway } from "@/lib/platform/contracts";
import { createTranscriptPolisher } from "./audio-transcription";
import { createDeterministicEmbeddingProvider } from "./embedding";
import { createInMemoryKnowledgeIndex } from "./knowledge-retrieval";
import { runDocumentKnowledgePipeline } from "./document-pipeline";

const trace = { traceId: "trace-a", workspaceId: "workspace-a" };

function fakeConverter() {
  return { convert: vi.fn(async (input: { name: string; format: string }) => ({ format: input.format as "pdf", extractedText: "texto extraído", canonicalMarkdown: `# ${input.name}\n\nTexto extraído sobre clareza e prazo.`, extractionConfidence: 0.96, trace: [] })) };
}

describe("document knowledge pipeline", () => {
  it("normalizes before creating chunks and indexing", async () => {
    const index = createInMemoryKnowledgeIndex();
    const result = await runDocumentKnowledgePipeline({ documentId: "doc-a", documentVersionId: "doc-a-v1", workspaceId: "workspace-a", name: "manual.pdf", mimeType: "application/pdf", bytes: new Uint8Array([1]), format: "pdf", traceContext: trace, converter: fakeConverter(), embeddingProvider: createDeterministicEmbeddingProvider(), index });
    expect(result.canonicalMarkdown).toContain("Texto extraído");
    expect(result.chunks.length).toBeGreaterThan(0);
    expect(result.conversionTrace.some((item) => item.step === "index" && item.status === "succeeded")).toBe(true);
    expect((await index.search({ workspaceId: "workspace-a", query: "clareza" })).evidence).toBe("FOUND");
  });

  it("uses Whisper output and Luna medium review before indexing audio", async () => {
    const gateway: InferenceGateway = { complete: vi.fn(async (input) => ({ text: "Texto revisado com clareza.", usage: { inputTokens: input.messages.length, outputTokens: 4 } })) };
    const transcriber = { transcribe: vi.fn(async () => ({ text: "texto bruto", provider: "openai", model: "whisper-1" })) };
    const polisher = createTranscriptPolisher(gateway);
    const index = createInMemoryKnowledgeIndex();
    const result = await runDocumentKnowledgePipeline({ documentId: "audio-a", documentVersionId: "audio-a-v1", workspaceId: "workspace-a", name: "entrevista.mp3", mimeType: "audio/mpeg", bytes: new Uint8Array([1]), format: "audio", traceContext: trace, converter: fakeConverter(), embeddingProvider: createDeterministicEmbeddingProvider(), index, transcriber, polisher });
    expect(result.canonicalMarkdown).toContain("Texto revisado");
    expect(transcriber.transcribe).toHaveBeenCalledOnce();
    expect(gateway.complete).toHaveBeenCalledWith(expect.objectContaining({ model: "gpt-5.6-luna", reasoning: { requestedReasoning: "medium", effectiveReasoning: "medium" } }));
    expect(result.conversionTrace.map((item) => item.step)).toEqual(expect.arrayContaining(["transcribe", "polish", "chunk", "embed", "index"]));
  });

  it("blocks audio when the transcription chain is not available", async () => {
    await expect(runDocumentKnowledgePipeline({ documentId: "audio-a", documentVersionId: "audio-a-v1", workspaceId: "workspace-a", name: "entrevista.mp3", mimeType: "audio/mpeg", bytes: new Uint8Array([1]), format: "audio", traceContext: trace, converter: fakeConverter(), embeddingProvider: createDeterministicEmbeddingProvider(), index: createInMemoryKnowledgeIndex() })).rejects.toThrow("Whisper");
  });
});
