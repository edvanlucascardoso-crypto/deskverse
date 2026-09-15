import { zodResolver } from "@hookform/resolvers/zod";
import { addWorkspaceMemberInputSchema, createWorkspaceInputSchema, workspacePreferenceInputSchema } from "@/zod/schemas/workspace";

export const createWorkspaceResolver = zodResolver(createWorkspaceInputSchema);
export const addWorkspaceMemberResolver = zodResolver(addWorkspaceMemberInputSchema);
export const workspacePreferenceResolver = zodResolver(workspacePreferenceInputSchema);
