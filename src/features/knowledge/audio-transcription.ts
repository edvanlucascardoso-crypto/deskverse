import type { InferenceGateway } from "@/lib/platform/contracts";
import type { TraceContext } from "@/lib/platform/contracts";
import { trace } from "./knowledge-domain";

export const whisperModel = "whisper-1";
export const transcriptReviewModel = "gpt-5.6-luna";
export const transcriptReviewReasoning = "medium";

export type AudioTranscriptionProvider = {
  transcribe(input: { name: string; mimeType: string; bytes: Uint8Array; trace: TraceContext }): Promise<{ text: string; provider: string; model: string }>;
};

export type TranscriptPolisher = {
  polish(input: { text: string; language?: string; trace: TraceContext }): Promise<{ text: string; provider: string; model: string; reasoning: string }>;
};

export class AudioTranscriptionError extends Error {
  readonly code: string;
  readonly waitingForUser: boolean;

  constructor(code: string, message: string, waitingForUser = false) {
    super(message);
    this.name = "AudioTranscriptionError";
    this.code = code;
    this.waitingForUser = waitingForUser;
  }
}

export function createOpenAiWhisperProvider(source: Record<string, string | undefined> = process.env): AudioTranscriptionProvider {
  return {
    async transcribe({ name, mimeType, bytes, trace: traceContext }) {
      const apiKey = source.OPENAI_API_KEY;
      if (!apiKey) throw new AudioTranscriptionError("OPENAI_KEY_MISSING", "A transcrição de áudio aguarda a configuração da chave da OpenAI.", true);
      const form = new FormData();
      form.append("file", new Blob([Buffer.from(bytes)], { type: mimeType || "application/octet-stream" }), name);
      form.append("model", source.OPENAI_TRANSCRIPTION_MODEL || whisperModel);
      form.append("response_format", "json");
      const response = await fetch(source.OPENAI_TRANSCRIPTION_URL || "https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
        body: form,
      });
      const payload = await response.json().catch(() => ({})) as { text?: string; error?: { message?: string } };
      if (!response.ok || !payload.text?.trim()) throw new AudioTranscriptionError("WHISPER_FAILED", payload.error?.message || "A OpenAI não retornou uma transcrição utilizável.");
      return { text: payload.text.trim(), provider: "openai", model: source.OPENAI_TRANSCRIPTION_MODEL || whisperModel };
    },
  };
}

export function createTranscriptPolisher(gateway: InferenceGateway): TranscriptPolisher {
  return {
    async polish({ text, language = "pt-BR", trace: traceContext }) {
      const result = await gateway.complete({
        model: transcriptReviewModel,
        messages: [
          { role: "system", content: "Você revisa transcrições de áudio. Corrija erros de reconhecimento, pontuação e fragmentos; preserve o sentido, nomes próprios e incertezas. Não invente fatos. Entregue apenas o texto revisado em Markdown simples." },
          { role: "user", content: `Idioma esperado: ${language}\n\nTranscrição bruta:\n${text}` },
        ],
        trace: traceContext,
        reasoning: { requestedReasoning: transcriptReviewReasoning, effectiveReasoning: transcriptReviewReasoning },
      });
      if (!result.text.trim()) throw new AudioTranscriptionError("TRANSCRIPT_REVIEW_EMPTY", "A revisão da transcrição não retornou texto.");
      return { text: result.text.trim(), provider: "InferenceGateway", model: transcriptReviewModel, reasoning: transcriptReviewReasoning };
    },
  };
}

export const audioTrace = {
  transcribed: (provider: string, model: string) => trace("transcribe", "succeeded", { provider, model }),
  polished: (provider: string, model: string, reasoning: string) => trace("polish", "succeeded", { provider, model, reasoning }),
};
