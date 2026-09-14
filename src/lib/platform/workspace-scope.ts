import { z } from "zod";

export const workspaceIdSchema = z.string().min(2).max(80).regex(/^[a-zA-Z0-9_-]+$/, "Identificador de espaço inválido.");

export function parseWorkspaceId(value: string) {
  const result = workspaceIdSchema.safeParse(value);
  if (!result.success) throw new Error("Identificador de espaço inválido.");
  return result.data;
}
