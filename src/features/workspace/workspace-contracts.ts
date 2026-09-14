import { z } from "zod";

export const createWorkspaceInputSchema = z.object({
  name: z.string().trim().min(2, "Informe um nome com pelo menos 2 caracteres.").max(80, "Use no máximo 80 caracteres."),
});

export const addWorkspaceMemberInputSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido."),
  role: z.enum(["ADMIN", "MEMBER", "VIEWER"]),
});

export const workspacePreferenceInputSchema = z.object({
  theme: z.enum(["light", "dark"]).optional(),
  view: z.enum(["all", "active", "available"]).optional(),
  selectedItemId: z.string().trim().max(120).nullable().optional(),
  layout: z.record(z.string(), z.unknown()).optional(),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceInputSchema>;
export type AddWorkspaceMemberInput = z.infer<typeof addWorkspaceMemberInputSchema>;
export type WorkspacePreferenceInput = z.infer<typeof workspacePreferenceInputSchema>;
