import "server-only";

import { platformEnvironmentSchema } from "@/zod/schemas/platform";
import type { PlatformEnvironment } from "@/types/platform";

export function readPlatformEnvironment(source: Record<string, string | undefined> = process.env): PlatformEnvironment {
  const result = platformEnvironmentSchema.safeParse(source);
  return result.success ? result.data : { NODE_ENV: source.NODE_ENV === "production" ? "production" : source.NODE_ENV === "test" ? "test" : "development" };
}

export function platformServiceStatus(source: PlatformEnvironment = readPlatformEnvironment()) {
  return [
    { id: "database", label: "Neon PostgreSQL", configured: Boolean(source.DATABASE_URL), owner: "Plataforma" },
    { id: "auth", label: "Better Auth", configured: Boolean(source.BETTER_AUTH_SECRET && source.BETTER_AUTH_URL), owner: "Plataforma" },
    { id: "queue", label: "Redis / QueueBackend", configured: Boolean(source.REDIS_URL), owner: "Execução" },
    { id: "storage", label: "UploadThing", configured: Boolean(source.UPLOADTHING_TOKEN), owner: "Arquivos" },
    { id: "transcription", label: "OpenAI Whisper", configured: Boolean(source.OPENAI_API_KEY), owner: "Conhecimento" },
    { id: "runtime", label: "Eve / AgentRuntime", configured: Boolean(source.EVE_RUNTIME_URL), owner: "Execução" },
    { id: "inference", label: "Vercel AI Gateway", configured: Boolean(source.INFERENCE_GATEWAY_URL), owner: "Inferência" },
  ] as const;
}
