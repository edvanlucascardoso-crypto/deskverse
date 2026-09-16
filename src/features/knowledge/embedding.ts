export type EmbeddingProvider = {
  embed(input: { text: string; workspaceId: string }): Promise<{ vector: number[]; provider: string; model: string }>;
};

function hashText(text: string, dimension: number) {
  const vector = Array.from({ length: dimension }, () => 0);
  for (let index = 0; index < text.length; index += 1) {
    const code = text.charCodeAt(index);
    vector[index % dimension] += ((code % 97) + 1) * (index % 5 === 0 ? 1 : -1);
  }
  const magnitude = Math.sqrt(vector.reduce((total, value) => total + value * value, 0)) || 1;
  return vector.map((value) => Number((value / magnitude).toFixed(8)));
}

export function createDeterministicEmbeddingProvider(dimension = 12): EmbeddingProvider {
  return {
    async embed({ text }) {
      return { vector: hashText(text, dimension), provider: "local-deterministic", model: `hash-${dimension}` };
    },
  };
}

export function createHttpEmbeddingProvider(source: Record<string, string | undefined> = process.env): EmbeddingProvider {
  return {
    async embed({ text, workspaceId }) {
      const endpoint = source.INFERENCE_GATEWAY_URL;
      if (!endpoint) throw new Error("O InferenceGateway ainda não está configurado para gerar embeddings.");
      const response = await fetch(`${endpoint.replace(/\/$/, "")}/embeddings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(source.INFERENCE_GATEWAY_TOKEN ? { Authorization: `Bearer ${source.INFERENCE_GATEWAY_TOKEN}` } : {}) },
        body: JSON.stringify({ text, workspaceId }),
      });
      const payload = await response.json().catch(() => ({})) as { vector?: number[]; provider?: string; model?: string; message?: string };
      if (!response.ok || !Array.isArray(payload.vector)) throw new Error(payload.message || "O InferenceGateway não retornou um embedding.");
      return { vector: payload.vector, provider: payload.provider || "InferenceGateway", model: payload.model || "configured-embedding" };
    },
  };
}
