export type AgentOrderRecord = {
  workspaceId: string;
  userId: string;
  order: string[];
  updatedAt: string;
};

export type AgentOrderSaveResult = { persisted: "device" | "server" };

export interface AgentOrderRepository {
  load(scope: Pick<AgentOrderRecord, "workspaceId" | "userId">): Promise<AgentOrderRecord | null>;
  save(record: AgentOrderRecord): Promise<AgentOrderSaveResult>;
}

const storageKey = (workspaceId: string, userId: string) => `deskverse:agent-order:${workspaceId}:${userId}`;

/**
 * Device-local adapter for the prototype. Replace this adapter with an API
 * backed by Prisma/PostgreSQL later; UI code depends only on the interface.
 */
export const deviceAgentOrderRepository: AgentOrderRepository = {
  async load({ workspaceId, userId }) {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(storageKey(workspaceId, userId));
    if (!raw) return null;
    try {
      const value = JSON.parse(raw) as AgentOrderRecord;
      return Array.isArray(value.order) ? value : null;
    } catch {
      return null;
    }
  },
  async save(record) {
    if (typeof window !== "undefined") window.localStorage.setItem(storageKey(record.workspaceId, record.userId), JSON.stringify(record));
    return { persisted: "device" };
  },
};

/**
 * Optimistic-sync boundary. Once the authenticated API exists, set
 * NEXT_PUBLIC_AGENT_ORDER_ENDPOINT to its URL. The endpoint receives one
 * mutation and is responsible for persisting it with Prisma/PostgreSQL.
 */
export const agentOrderRepository: AgentOrderRepository = {
  load: (scope) => deviceAgentOrderRepository.load(scope),
  async save(record) {
    const endpoint = process.env.NEXT_PUBLIC_AGENT_ORDER_ENDPOINT;
    if (endpoint) {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(record),
      });
      if (!response.ok) throw new Error("Não foi possível sincronizar a ordem dos agentes.");
      await deviceAgentOrderRepository.save(record);
      return { persisted: "server" };
    }
    return deviceAgentOrderRepository.save(record);
  },
};

export function mergeAgentOrder(savedOrder: string[], availableIds: string[]) {
  const available = new Set(availableIds);
  const retained = savedOrder.filter((id) => available.delete(id));
  return [...retained, ...availableIds.filter((id) => available.has(id))];
}

/** Moves the dragged item as an insertion, so the other slots reflow. */
export function moveAgent(order: string[], sourceId: string, targetId: string) {
  const sourceIndex = order.indexOf(sourceId);
  const targetIndex = order.indexOf(targetId);
  if (sourceId === targetId || sourceIndex < 0 || targetIndex < 0) return order;
  const next = order.filter((id) => id !== sourceId);
  const targetAfterRemoval = next.indexOf(targetId);
  const insertionIndex = sourceIndex < targetIndex ? targetAfterRemoval + 1 : targetAfterRemoval;
  next.splice(insertionIndex, 0, sourceId);
  return next;
}
