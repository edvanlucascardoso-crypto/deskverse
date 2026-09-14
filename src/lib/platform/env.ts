import "server-only";

import { z } from "zod";

const platformEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().optional(),
  DIRECT_URL: z.string().optional(),
  BETTER_AUTH_SECRET: z.string().optional(),
  BETTER_AUTH_URL: z.string().url().optional(),
  REDIS_URL: z.string().optional(),
  UPLOADTHING_TOKEN: z.string().optional(),
  INFERENCE_GATEWAY_URL: z.string().url().optional(),
  EVE_RUNTIME_URL: z.string().url().optional(),
  MCP_CHANNELS_URL: z.string().url().optional(),
  MCP_MEDIA_URL: z.string().url().optional(),
});

export type PlatformEnvironment = z.infer<typeof platformEnvSchema>;

export function readPlatformEnvironment(source: Record<string, string | undefined> = process.env): PlatformEnvironment {
  const result = platformEnvSchema.safeParse(source);
  return result.success ? result.data : { NODE_ENV: source.NODE_ENV === "production" ? "production" : source.NODE_ENV === "test" ? "test" : "development" };
}

export function platformServiceStatus(source: PlatformEnvironment = readPlatformEnvironment()) {
  return [
    { id: "database", label: "Neon PostgreSQL", configured: Boolean(source.DATABASE_URL), owner: "Plataforma" },
    { id: "auth", label: "Better Auth", configured: Boolean(source.BETTER_AUTH_SECRET && source.BETTER_AUTH_URL), owner: "Plataforma" },
    { id: "queue", label: "Redis / QueueBackend", configured: Boolean(source.REDIS_URL), owner: "Execução" },
    { id: "storage", label: "UploadThing", configured: Boolean(source.UPLOADTHING_TOKEN), owner: "Arquivos" },
    { id: "runtime", label: "Eve / AgentRuntime", configured: Boolean(source.EVE_RUNTIME_URL), owner: "Execução" },
    { id: "inference", label: "Vercel AI Gateway", configured: Boolean(source.INFERENCE_GATEWAY_URL), owner: "Inferência" },
  ] as const;
}
