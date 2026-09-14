"use client";

import type { WorkspaceLoadResult, WorkspaceRepository } from "./workspace-domain";

export const platformWorkspaceRepository: WorkspaceRepository = {
  async load(workspaceId) {
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}`, { cache: "no-store" });
      if (response.ok) {
        const body = await response.json() as { workspace?: { id: string; name: string; organizationName: string; memberCount: number } };
        if (body.workspace) return { ok: true, snapshot: { state: "success", context: { workspaceId: body.workspace.id, organizationId: body.workspace.organizationName, name: body.workspace.name, source: "Prisma / PostgreSQL", owner: "Você", updatedAt: "agora", nextStep: `${body.workspace.memberCount} pessoas podem acompanhar este espaço` }, agentOrder: [] } };
      }
      if (response.status === 401) return { ok: false, message: "Sua sessão expirou. Entre novamente para continuar." };
      if (response.status === 404) return { ok: false, message: "Você não tem acesso a este workspace." };
      return { ok: false, message: "A plataforma não respondeu ao carregar o workspace." };
    } catch {
      return { ok: false, message: "A conexão com a plataforma falhou." };
    }
    return { ok: false, message: "Não foi possível carregar o workspace." };
  },
};
