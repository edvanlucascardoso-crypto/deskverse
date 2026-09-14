import { AnimatePresence, motion } from "motion/react";
import { CircleAlert, LoaderCircle, RotateCcw, Sparkles } from "lucide-react";
import { Fragment, useRef, type CSSProperties, type KeyboardEvent } from "react";
import { type Agent, type AgentActivity, type AgentCommunication, type CanvasState } from "./agent-data";
import { AgentTile } from "./agent-tile";
import { AgentDragOverlay } from "./agent-drag-overlay";
import { CommunicationLink } from "./communication-link";
import { Feedback } from "./feedback";
import type { CanvasAnimationEvent } from "./canvas-animation-events";

export type AgentEntry = { agent: Agent; activity: AgentActivity };

type WorkspaceCanvasProps = {
  canvasState: CanvasState;
  entries: AgentEntry[];
  selected: string | null;
  focused: string;
  zoom: number;
  communication: AgentCommunication | null;
  isReordering: boolean;
  animationEvent: CanvasAnimationEvent | null;
  reduced: boolean | null;
  onSelect: (id: string) => void;
  onDragStart: (id: string) => void;
  onPreviewReorder: (sourceId: string, targetId: string) => void;
  onOrderCommit: () => void;
  onOrderCancel: () => void;
  onCanvasKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  onRecover: () => void;
};

export function WorkspaceCanvas({ canvasState, entries, selected, focused, zoom, communication, isReordering, animationEvent, reduced, onSelect, onDragStart, onPreviewReorder, onOrderCommit, onOrderCancel, onCanvasKeyDown, onRecover }: WorkspaceCanvasProps) {
  const wallRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const gridColumns = Math.max(1, Math.ceil(Math.sqrt(entries.length)));
  const mobileGridColumns = 4;
  const wallMaxWidth = gridColumns * 180 + Math.max(0, gridColumns - 1) * 18;
  const wallStyle = { "--wall-scale": zoom / 100, "--agent-columns": gridColumns, "--agent-mobile-columns": mobileGridColumns, "--agent-wall-max-width": wallMaxWidth + "px" } as CSSProperties;
  const leaders = entries.filter(({ agent }) => agent.kind === "leader");
  const renderTile = ({ agent, activity }: AgentEntry, index: number) => <Fragment key={agent.id}><AgentTile agent={agent} activity={activity} selected={selected === agent.id} focused={focused === agent.id} isReordering={isReordering} animationEvent={animationEvent} animationIndex={index} reduced={reduced} tileRef={(node) => { tileRefs.current[agent.id] = node; }} onDragStart={onDragStart} onPreviewReorder={onPreviewReorder} onOrderCommit={onOrderCommit} onOrderCancel={onOrderCancel} onSelect={() => onSelect(agent.id)} /></Fragment>;
  return <>
    <section className={"workspace-canvas" + (isReordering ? " is-reordering" : "")} tabIndex={0} onKeyDown={onCanvasKeyDown} aria-busy={isReordering} aria-label="Canvas em grade de agentes. Use as setas para navegar e Escape para limpar a seleção.">
    <AnimatePresence mode="wait">
      {canvasState === "loading" && <Feedback icon={<LoaderCircle className="spin" size={30} />} title="Atualizando o canvas" text="Buscando presença e atividade dos agentes." />}
      {canvasState === "empty" && <Feedback icon={<Sparkles size={30} />} title="O canvas está pronto" text="Quando os agentes começarem a trabalhar, eles aparecerão aqui." action={<button className="primary-button" onClick={onRecover}><RotateCcw size={16} /> Atualizar</button>} />}
      {canvasState === "error" && <Feedback error icon={<CircleAlert size={30} />} title="Não foi possível atualizar" text="Os últimos estados conhecidos continuam seguros." action={<button className="secondary-button" onClick={onRecover}>Tentar novamente</button>} />}
      {canvasState === "success" && <motion.div ref={wallRef} className="agent-wall" id="agents" layout={!reduced} initial={false} animate={{ opacity: 1 }} style={wallStyle}>
        {communication && <CommunicationLink communication={communication} wallRef={wallRef} tileRefs={tileRefs} scale={zoom / 100} reduced={reduced} />}
        <div className="agent-zone"><div className="agent-zone-grid">{leaders.map(renderTile)}</div></div>
        {!entries.length && <p className="grid-empty">Nenhum agente corresponde à busca ou ao filtro.</p>}
      </motion.div>}
    </AnimatePresence>
    </section>
    <AgentDragOverlay entries={entries} />
  </>;
}
