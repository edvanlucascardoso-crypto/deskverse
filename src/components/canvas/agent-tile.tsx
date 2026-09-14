"use client";

import { motion, useAnimationControls } from "motion/react";
import { useDrag, useDrop } from "react-dnd";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { AGENT_TILE, type AgentTileDragItem } from "./agent-dnd";
import { activityLabel, isActiveActivity, statusColor, type Agent, type AgentActivity } from "./agent-data";
import type { CanvasAnimationEvent } from "./canvas-animation-events";

type AgentTileProps = {
  agent: Agent;
  activity: AgentActivity;
  selected: boolean;
  focused: boolean;
  isReordering: boolean;
  animationEvent: CanvasAnimationEvent | null;
  animationIndex: number;
  reduced: boolean | null;
  tileRef?: (node: HTMLButtonElement | null) => void;
  onDragStart: (id: string) => void;
  onPreviewReorder: (sourceId: string, targetId: string) => void;
  onOrderCommit: () => void;
  onOrderCancel: () => void;
  onSelect: () => void;
};

export function AgentTile({ agent, activity, selected, focused, isReordering, animationEvent, animationIndex, reduced, tileRef, onDragStart, onPreviewReorder, onOrderCommit, onOrderCancel, onSelect }: AgentTileProps) {
  const Icon = agent.icon;
  const isActive = isActiveActivity(activity);
  const nodeRef = useRef<HTMLButtonElement | null>(null);
  const pressTimerRef = useRef<number | null>(null);
  const pressStartRef = useRef({ x: 0, y: 0 });
  const dndStartedRef = useRef(false);
  const longPressTriggeredRef = useRef(false);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const animationControls = useAnimationControls();

  const clearPressTimer = useCallback(() => {
    if (pressTimerRef.current !== null) window.clearTimeout(pressTimerRef.current);
    pressTimerRef.current = null;
  }, []);

  useEffect(() => clearPressTimer, [clearPressTimer]);

  const [{ isDragging }, drag] = useDrag<AgentTileDragItem, { targetId: string }, { isDragging: boolean }>(() => ({
    type: AGENT_TILE,
    item: () => {
      const rect = nodeRef.current?.getBoundingClientRect();
      dndStartedRef.current = true;
      longPressTriggeredRef.current = true;
      onDragStart(agent.id);
      return { id: agent.id, width: rect?.width ?? 80, height: rect?.height ?? 100 };
    },
    end: (item, monitor) => {
      clearPressTimer();
      setIsLongPressing(false);
      dndStartedRef.current = false;
      longPressTriggeredRef.current = false;
      // The touch backend can finish a drag outside a formal drop target even
      // after hover has already previewed a valid slot. Keep that preview.
      if (monitor.didDrop() || item.lastTargetId) onOrderCommit();
      else onOrderCancel();
    },
    isDragging: (monitor) => monitor.getItem<AgentTileDragItem>()?.id === agent.id,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }), [agent.id, clearPressTimer, onDragStart, onOrderCancel, onOrderCommit]);
  const baseScale = isDragging || isLongPressing ? 1.1 : isReordering ? .9 : 1;

  useEffect(() => {
    void animationControls.start({ scale: baseScale, x: 0, y: 0, transition: { duration: reduced ? 0 : .18, ease: [0.22, 1, 0.36, 1] } });
  }, [animationControls, baseScale, reduced]);

  useEffect(() => {
    if (!animationEvent || animationEvent.kind === "limpar") return;
    const isActor = animationEvent.actorId === agent.id;
    const isTarget = animationEvent.targetId === agent.id;
    if (animationEvent.kind === "entrada") {
      void animationControls.start({ opacity: [0, 1], y: [12, 0], transition: { duration: reduced ? 0 : .32, delay: reduced ? 0 : animationIndex * .035, ease: [0.22, 1, 0.36, 1] } });
      return;
    }
    if (!isActor && !isTarget) return;
    if (animationEvent.kind === "erro") {
      void animationControls.start({ x: [0, -3, 3, -2, 2, 0], transition: { duration: reduced ? 0 : .34, ease: "easeOut" } });
      return;
    }
    void animationControls.start({ scale: [baseScale, baseScale * (animationEvent.kind === "comunicacao" ? 1.055 : 1.07), baseScale], transition: { duration: reduced ? 0 : .38, ease: [0.22, 1, 0.36, 1] } });
  }, [agent.id, animationControls, animationEvent, animationIndex, baseScale, reduced]);

  const [, drop] = useDrop<AgentTileDragItem, { targetId: string }>(() => ({
    accept: AGENT_TILE,
    canDrop: (item) => item.id !== agent.id,
    hover: (item, monitor) => {
      if (item.id === agent.id || !monitor.isOver({ shallow: true }) || item.lastTargetId === agent.id) return;
      item.lastTargetId = agent.id;
      onPreviewReorder(item.id, agent.id);
    },
    drop: (item) => ({ targetId: item.id === agent.id ? "" : agent.id }),
  }), [agent.id, onPreviewReorder]);

  const setNode = useCallback((node: HTMLButtonElement | null) => {
    nodeRef.current = node;
    drag(drop(node));
    tileRef?.(node);
  }, [drag, drop, tileRef]);

  const className = "agent-tile" + (isActive ? " is-active" : "") + (activity === "communicating" ? " is-communicating" : "") + (selected ? " is-selected" : "") + (focused ? " is-focused" : "") + (isDragging ? " is-drag-source" : "");
  const style = { "--agent-color": agent.color, "--status-color": statusColor(activity) } as CSSProperties;
  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    clearPressTimer();
    dndStartedRef.current = false;
    longPressTriggeredRef.current = false;
    pressStartRef.current = { x: event.clientX, y: event.clientY };
    if (event.pointerType === "mouse") return;
    pressTimerRef.current = window.setTimeout(() => {
      pressTimerRef.current = null;
      longPressTriggeredRef.current = true;
      setIsLongPressing(true);
      onDragStart(agent.id);
    }, 1000);
  };
  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (pressTimerRef.current === null) return;
    const distance = Math.hypot(event.clientX - pressStartRef.current.x, event.clientY - pressStartRef.current.y);
    if (distance > 9) clearPressTimer();
  };
  const handlePointerEnd = () => {
    clearPressTimer();
    if (!dndStartedRef.current && longPressTriggeredRef.current) {
      setIsLongPressing(false);
      longPressTriggeredRef.current = false;
      onOrderCancel();
    }
  };

  return <motion.button ref={setNode} data-agent-id={agent.id} type="button" draggable={false} layout={!reduced} initial={false} animate={animationControls} whileHover={reduced || isDragging || isReordering ? undefined : { y: -3, scale: 1.015 }} whileTap={reduced || isDragging || isReordering ? undefined : { scale: .985 }} transition={{ layout: { duration: reduced ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }, default: { duration: reduced ? 0 : .18, ease: [0.22, 1, 0.36, 1] } }} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerEnd} onPointerCancel={handlePointerEnd} onClick={() => { if (!isDragging && !isLongPressing) onSelect(); }} className={className} style={style} aria-pressed={selected} aria-label={`${agent.name}. ${activityLabel(activity)}. Segure por um segundo para reorganizar.`}>
    <span className="agent-logo" aria-hidden="true"><Icon size={96} strokeWidth={.5} /></span>
    <span className="agent-copy"><span className="agent-kind">{agent.kind === "leader" ? "Líder" : "Especialista"}</span><span className="agent-name">{agent.name}</span><span className="agent-role">{agent.role} · {agent.seniority}</span></span>
    <motion.span key={activity} className="agent-status" initial={{ scale: .72, opacity: .35 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: reduced ? 0 : .24, ease: [0.22, 1, 0.36, 1] }} title={activityLabel(activity)} aria-label={activityLabel(activity)}><i /></motion.span>
    <span className="agent-task">{activity === "communicating" ? "Em comunicação" : activity === "error" ? "Precisa de ajuda" : activity === "waiting" ? "Aguardando resposta" : agent.taskSummary}</span>
  </motion.button>;
}
