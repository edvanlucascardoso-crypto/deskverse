import "server-only";

import { ensureDefaultWorkspace, listUserWorkspacesCached } from "./platform-workspace-repository";
import type { WorkspaceSummary } from "@/types/workspace";

export type ServerWorkspaceBootstrap = {
  initialWorkspace: WorkspaceSummary | null;
  error: string | null;
};

export async function getServerWorkspaceBootstrap(user: { id: string; name: string; email: string }): Promise<ServerWorkspaceBootstrap> {
  try {
    await ensureDefaultWorkspace(user);
    const workspaces = await listUserWorkspacesCached(user.id);
    return {
      initialWorkspace: workspaces[0] ?? null,
      error: workspaces.length > 0 ? null : "Sua conta ainda não tem um workspace disponível.",
    };
  } catch {
    return {
      initialWorkspace: null,
      error: "Não foi possível carregar seu workspace agora.",
    };
  }
}
