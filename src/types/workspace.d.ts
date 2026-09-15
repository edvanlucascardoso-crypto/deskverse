import type { z } from "zod";
import type { addWorkspaceMemberInputSchema, createWorkspaceInputSchema, workspacePreferenceInputSchema } from "@/zod/schemas/workspace";
import type { WorkspaceRole } from "@/types/permissions";

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceInputSchema>;
export type AddWorkspaceMemberInput = z.infer<typeof addWorkspaceMemberInputSchema>;
export type WorkspacePreferenceInput = z.infer<typeof workspacePreferenceInputSchema>;

export type WorkspaceLoadState = "loading" | "empty" | "success" | "error";
export type WorkspaceContext = { workspaceId: string; organizationId: string; name: string; source: string; owner: string; updatedAt: string; nextStep: string };
export type WorkspaceSnapshot = { context: WorkspaceContext; state: WorkspaceLoadState; agentOrder: string[] };
export type WorkspaceLoadResult = { ok: true; snapshot: WorkspaceSnapshot } | { ok: false; message: string; lastSnapshot?: WorkspaceSnapshot };
export interface WorkspaceRepository { load(workspaceId: string): Promise<WorkspaceLoadResult>; }
export type WorkspaceSummary = { id: string; organizationId: string; organizationName: string; name: string; slug: string; role: WorkspaceRole; memberCount: number; updatedAt: string };
