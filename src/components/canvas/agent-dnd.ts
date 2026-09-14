export const AGENT_TILE = "deskverse-agent-tile";

/** Mutable only for the lifetime of a drag operation. */
export type AgentTileDragItem = { id: string; width: number; height: number; lastTargetId?: string };
