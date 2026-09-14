export type WorkspaceLoadState = "loading" | "empty" | "success" | "error";

export type WorkspaceContext = {
  workspaceId: string;
  organizationId: string;
  name: string;
  source: string;
  owner: string;
  updatedAt: string;
  nextStep: string;
};

export type WorkspaceSnapshot = {
  context: WorkspaceContext;
  state: WorkspaceLoadState;
  agentOrder: string[];
};

export type WorkspaceLoadResult =
  | { ok: true; snapshot: WorkspaceSnapshot }
  | { ok: false; message: string; lastSnapshot?: WorkspaceSnapshot };

export interface WorkspaceRepository {
  load(workspaceId: string): Promise<WorkspaceLoadResult>;
}
