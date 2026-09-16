import type { KnowledgeChunk, KnowledgeSearchResult } from "@/types/knowledge";
import type { EmbeddingProvider } from "./embedding";

type SearchInput = { workspaceId: string; query: string; limit?: number; authorizedResourceIds?: string[] };

function tokens(value: string) {
  return new Set(value.toLocaleLowerCase("pt-BR").split(/[^\p{L}\p{N}]+/u).filter((token) => token.length > 2));
}

function lexicalScore(query: string, content: string) {
  const wanted = tokens(query);
  const available = tokens(content);
  if (!wanted.size) return 0;
  let matched = 0;
  for (const token of wanted) if (available.has(token)) matched += 1;
  return matched / wanted.size;
}

function cosine(a: number[] | undefined, b: number[] | undefined) {
  if (!a?.length || !b?.length || a.length !== b.length) return 0;
  let dot = 0;
  let aMagnitude = 0;
  let bMagnitude = 0;
  for (let index = 0; index < a.length; index += 1) {
    dot += a[index] * b[index];
    aMagnitude += a[index] * a[index];
    bMagnitude += b[index] * b[index];
  }
  return dot / ((Math.sqrt(aMagnitude) * Math.sqrt(bMagnitude)) || 1);
}

function isAuthorized(chunk: KnowledgeChunk, workspaceId: string, authorizedResourceIds?: string[]) {
  if (chunk.workspaceId !== workspaceId) return false;
  const permissions = chunk.permissions;
  if (!permissions) return true;
  const allowedWorkspaces = permissions.allowedWorkspaceIds;
  if (Array.isArray(allowedWorkspaces) && !allowedWorkspaces.includes(workspaceId)) return false;
  if (authorizedResourceIds) {
    const allowedResources = permissions.allowedResourceIds;
    if (Array.isArray(allowedResources) && !allowedResources.some((id) => authorizedResourceIds.includes(String(id)))) return false;
  }
  return true;
}

export function searchKnowledgeChunks(input: SearchInput & { chunks: KnowledgeChunk[]; queryVector?: number[] }): KnowledgeSearchResult {
  const limit = input.limit ?? 5;
  const chunks = input.chunks
    .filter((chunk) => isAuthorized(chunk, input.workspaceId, input.authorizedResourceIds))
    .map((chunk) => ({ ...chunk, score: lexicalScore(input.query, chunk.content) * 0.55 + cosine(input.queryVector, (chunk as KnowledgeChunk & { vector?: number[] }).vector) * 0.45 }))
    .filter((chunk) => (chunk.score ?? 0) > 0)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, limit);
  return {
    query: input.query,
    evidence: chunks.length ? "FOUND" : "INSUFFICIENT",
    chunks,
    answerContext: chunks.length ? chunks.map((chunk) => `[${chunk.sourceName || "Documento"} · ${chunk.titlePath}]\n${chunk.content}`).join("\n\n") : "Não há evidência suficiente na base autorizada.",
  };
}

export type KnowledgeIndex = {
  index(input: { chunks: KnowledgeChunk[]; vectors: number[][] }): Promise<void>;
  search(input: SearchInput & { queryVector?: number[] }): Promise<KnowledgeSearchResult>;
};

export function createInMemoryKnowledgeIndex(): KnowledgeIndex {
  const chunks = new Map<string, KnowledgeChunk & { vector?: number[] }>();
  return {
    async index({ chunks: incoming, vectors }) {
      for (let index = 0; index < incoming.length; index += 1) chunks.set(incoming[index].id, { ...incoming[index], vector: vectors[index] });
    },
    async search(input) {
      return searchKnowledgeChunks({ ...input, chunks: [...chunks.values()] });
    },
  };
}

export function createSearchEmbeddingProvider(provider: EmbeddingProvider) {
  return {
    async search(input: SearchInput & { textForEmbedding?: string }) {
      const embedded = await provider.embed({ text: input.textForEmbedding ?? input.query, workspaceId: input.workspaceId });
      return { vector: embedded.vector, provider: embedded.provider, model: embedded.model };
    },
  };
}
