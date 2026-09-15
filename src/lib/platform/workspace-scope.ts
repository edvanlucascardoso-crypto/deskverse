import { workspaceIdSchema } from "@/zod/schemas/workspace";

export function parseWorkspaceId(value: string) {
  const result = workspaceIdSchema.safeParse(value);
  if (!result.success) throw new Error("Identificador de espaço inválido.");
  return result.data;
}
