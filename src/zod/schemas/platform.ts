import { z } from "zod";

export const platformEnvironmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().optional(),
  DIRECT_URL: z.string().optional(),
  BETTER_AUTH_SECRET: z.string().optional(),
  BETTER_AUTH_URL: z.string().url().optional(),
  REDIS_URL: z.string().optional(),
  UPLOADTHING_TOKEN: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_TRANSCRIPTION_MODEL: z.string().optional(),
  OPENAI_TRANSCRIPTION_URL: z.string().url().optional(),
  INFERENCE_GATEWAY_URL: z.string().url().optional(),
  INFERENCE_GATEWAY_TOKEN: z.string().optional(),
  EVE_RUNTIME_URL: z.string().url().optional(),
  MCP_CHANNELS_URL: z.string().url().optional(),
  MCP_MEDIA_URL: z.string().url().optional(),
});
