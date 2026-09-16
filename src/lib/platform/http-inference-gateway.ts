import "server-only";

import type { InferenceGateway } from "./contracts";

export function createHttpInferenceGateway(source: Record<string, string | undefined> = process.env): InferenceGateway {
  return {
    async complete(input) {
      const endpoint = source.INFERENCE_GATEWAY_URL;
      if (!endpoint) throw new Error("O InferenceGateway ainda não está configurado para revisar este texto.");
      const response = await fetch(`${endpoint.replace(/\/$/, "")}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(source.INFERENCE_GATEWAY_TOKEN ? { Authorization: `Bearer ${source.INFERENCE_GATEWAY_TOKEN}` } : {}) },
        body: JSON.stringify(input),
      });
      const payload = await response.json().catch(() => ({})) as { text?: string; usage?: { inputTokens: number; outputTokens: number }; message?: string };
      if (!response.ok || !payload.text) throw new Error(payload.message || "O InferenceGateway não conseguiu revisar o texto.");
      return { text: payload.text, usage: payload.usage };
    },
  };
}
