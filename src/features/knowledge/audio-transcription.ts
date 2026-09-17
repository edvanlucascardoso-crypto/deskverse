import { experimental_transcribe, type TranscriptionResult } from "ai";
import { createGateway, GatewayAuthenticationError } from "@ai-sdk/gateway";
import type { InferenceGateway } from "@/lib/platform/contracts";
import type { TraceContext } from "@/lib/platform/contracts";
import { trace } from "./knowledge-domain";

export const whisperModel = "openai/whisper-1";
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

type GatewayTranscribe = typeof experimental_transcribe;

type VercelWhisperProviderDependencies = {
  transcribe?: GatewayTranscribe;
};

function hasGatewayAuthentication(source: Record<string, string | undefined>) {
  return Boolean(source.AI_GATEWAY_API_KEY || source.VERCEL_OIDC_TOKEN || source.VERCEL === "1");
}

function missingGatewayAuthenticationError() {
  return new AudioTranscriptionError(
    "AI_GATEWAY_AUTH_MISSING",
    "A transcrição de áudio aguarda a configuração do Vercel AI Gateway (`AI_GATEWAY_API_KEY`) ou a autenticação OIDC da Vercel.",
    true,
  );
}

function gatewayErrorMessage(error: unknown) {
  return error instanceof Error && error.message.trim()
    ? error.message
    : "O Vercel AI Gateway não retornou uma transcrição utilizável.";
}

export function createVercelAiGatewayWhisperProvider(
  source: Record<string, string | undefined> = process.env,
  dependencies: VercelWhisperProviderDependencies = {},
): AudioTranscriptionProvider {
  const gateway = createGateway({ apiKey: source.AI_GATEWAY_API_KEY });
  const transcribe = dependencies.transcribe ?? experimental_transcribe;
  const model = source.AI_GATEWAY_TRANSCRIPTION_MODEL?.trim() || whisperModel;

  return {
    async transcribe({ bytes }) {
      if (!hasGatewayAuthentication(source) && transcribe === experimental_transcribe) throw missingGatewayAuthenticationError();
      try {
        const result: TranscriptionResult = await transcribe({
          model: gateway.transcriptionModel(model),
          audio: bytes,
          maxRetries: 2,
        });
        if (!result.text.trim()) throw new AudioTranscriptionError("WHISPER_EMPTY", "O Vercel AI Gateway não retornou uma transcrição utilizável.");
        return { text: result.text.trim(), provider: "Vercel AI Gateway", model };
      } catch (error) {
        if (error instanceof AudioTranscriptionError) throw error;
        if (GatewayAuthenticationError.isInstance(error) && !source.AI_GATEWAY_API_KEY && !source.VERCEL_OIDC_TOKEN) throw missingGatewayAuthenticationError();
        throw new AudioTranscriptionError("WHISPER_GATEWAY_FAILED", gatewayErrorMessage(error));
      }
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
