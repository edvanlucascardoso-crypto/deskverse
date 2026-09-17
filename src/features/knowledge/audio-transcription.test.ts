import { experimental_transcribe, type TranscriptionResult } from "ai";
import { describe, expect, it, vi } from "vitest";
import { createVercelAiGatewayWhisperProvider, whisperModel } from "./audio-transcription";

const trace = { traceId: "trace-audio", workspaceId: "workspace-a" };
const freeGatewayTranscriptionModel = "fish-audio/transcribe-1-free";

function input() {
  return { name: "nota.mp3", mimeType: "audio/mpeg", bytes: new Uint8Array([1, 2, 3]), trace };
}

describe("Vercel AI Gateway Whisper provider", () => {
  it("uses the configured free Gateway transcription model without calling the OpenAI audio endpoint directly", async () => {
    const transcribe = vi.fn(async (request: Parameters<typeof experimental_transcribe>[0]): Promise<TranscriptionResult> => ({
      text: "Transcrição do Gateway.",
      segments: [],
      language: "pt",
      durationInSeconds: 3,
      warnings: [],
      responses: [],
      providerMetadata: {},
    }));
    const provider = createVercelAiGatewayWhisperProvider({ AI_GATEWAY_API_KEY: "gateway-test-key", AI_GATEWAY_TRANSCRIPTION_MODEL: freeGatewayTranscriptionModel }, { transcribe });

    const result = await provider.transcribe(input());

    expect(result).toEqual({ text: "Transcrição do Gateway.", provider: "Vercel AI Gateway", model: freeGatewayTranscriptionModel });
    expect(transcribe).toHaveBeenCalledOnce();
    const request = transcribe.mock.calls[0]?.[0];
    expect(request?.audio).toEqual(input().bytes);
    expect(request?.maxRetries).toBe(2);
    expect((request?.model as { modelId?: string }).modelId).toBe(freeGatewayTranscriptionModel);
  });

  it("keeps Whisper as the production fallback when no model override is supplied", async () => {
    const transcribe = vi.fn(async (): Promise<TranscriptionResult> => ({
      text: "Transcrição padrão.",
      segments: [],
      language: "pt",
      durationInSeconds: 3,
      warnings: [],
      responses: [],
      providerMetadata: {},
    }));
    const provider = createVercelAiGatewayWhisperProvider({ AI_GATEWAY_API_KEY: "gateway-test-key" }, { transcribe });

    await provider.transcribe(input());

    const request = transcribe.mock.calls[0]?.[0];
    expect((request?.model as { modelId?: string }).modelId).toBe(whisperModel);
  });

  it("puts audio in WAITING_USER when Gateway authentication is unavailable", async () => {
    const provider = createVercelAiGatewayWhisperProvider({});

    await expect(provider.transcribe(input())).rejects.toMatchObject({
      code: "AI_GATEWAY_AUTH_MISSING",
      waitingForUser: true,
    });
  });

  it("keeps Gateway failures recoverable without treating them as missing credentials", async () => {
    const transcribe = vi.fn(async () => {
      throw new Error("Gateway indisponível");
    });
    const provider = createVercelAiGatewayWhisperProvider({ AI_GATEWAY_API_KEY: "gateway-test-key" }, { transcribe });

    await expect(provider.transcribe(input())).rejects.toMatchObject({ code: "WHISPER_GATEWAY_FAILED", waitingForUser: false });
  });
});
