"use client";

import { useDragLayer } from "react-dnd";
import { type CSSProperties } from "react";
import { type AgentEntry } from "./workspace-canvas";

type AgentDragOverlayProps = { entries: AgentEntry[] };

/** The lifted card lives in viewport coordinates, outside the transformed wall. */
export function AgentDragOverlay({ entries }: AgentDragOverlayProps) {
  const { item, isDragging, sourceOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem<{ id: string; width: number; height: number }>(),
    isDragging: monitor.isDragging(),
    sourceOffset: monitor.getSourceClientOffset(),
  }));
  const entry = entries.find(({ agent }) => agent.id === item?.id);
  if (!isDragging || !sourceOffset || !entry) return null;
  const Icon = entry.agent.icon;
  const style = { width: `${item.width}px`, height: `${item.height}px`, transform: `translate3d(${sourceOffset.x}px, ${sourceOffset.y}px, 0) scale(1.1)` } as CSSProperties;

  return <div className="agent-drag-overlay" aria-hidden="true"><div className="agent-drag-preview" style={style}><span className="agent-drag-preview-icon"><Icon strokeWidth={.5} /></span><span>{entry.agent.name}</span></div></div>;
}
