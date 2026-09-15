import type { WorkspaceLoadResult, WorkspaceRepository, WorkspaceSnapshot } from "@/types/workspace";

type LocalWorkspaceFixture = WorkspaceSnapshot | "empty" | "error";

const fixtures: Record<string, LocalWorkspaceFixture> = {
  "workspace-demo": {
    state: "success",
    context: {
      workspaceId: "workspace-demo",
      organizationId: "organization-demo",
      name: "Estúdio Aurora",
      source: "Dados locais",
      owner: "Você",
      updatedAt: "agora",
      nextStep: "Conectar a persistência da plataforma",
    },
    agentOrder: [],
  },
};

/**
 * Adapter temporário da Sprint 06-01. As próximas sprints substituem este
 * módulo por Prisma sem expor detalhes de banco aos componentes de interface.
 */
export const localWorkspaceRepository: WorkspaceRepository = {
  async load(workspaceId: string): Promise<WorkspaceLoadResult> {
    const fixture = fixtures[workspaceId];
    if (fixture === "error") return { ok: false, message: "Não foi possível carregar o espaço." };
    if (fixture === "empty" || !fixture) {
      return {
        ok: true,
        snapshot: {
          state: "empty",
          context: {
            workspaceId,
            organizationId: "organization-demo",
            name: "Espaço sem agentes",
            source: "Dados locais",
            owner: "Você",
            updatedAt: "agora",
            nextStep: "Adicionar o primeiro líder",
          },
          agentOrder: [],
        },
      };
    }
    return { ok: true, snapshot: fixture };
  },
};
