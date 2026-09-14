import { useEffect, useState, type RefObject } from "react";
import type { AgentCommunication } from "./agent-data";

type Point = { x: number; y: number };
type LinkPoints = { from: Point; to: Point; width: number; height: number };

type CommunicationLinkProps = {
  communication: AgentCommunication;
  wallRef: RefObject<HTMLDivElement | null>;
  tileRefs: RefObject<Record<string, HTMLButtonElement | null>>;
  scale: number;
  reduced: boolean | null;
};

function edgePoint(origin: Point, target: Point, width: number, height: number) {
  const dx = target.x - origin.x;
  const dy = target.y - origin.y;
  const distance = Math.max(Math.abs(dx) / (width / 2), Math.abs(dy) / (height / 2), 1);
  return { x: origin.x + dx / distance, y: origin.y + dy / distance };
}

export function CommunicationLink({ communication, wallRef, tileRefs, scale, reduced }: CommunicationLinkProps) {
  const [points, setPoints] = useState<LinkPoints | null>(null);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      const wall = wallRef.current;
      const from = tileRefs.current[communication.fromId];
      const to = tileRefs.current[communication.toId];
      if (!wall || !from || !to) return;
      const wallBox = wall.getBoundingClientRect();
      const fromBox = from.getBoundingClientRect();
      const toBox = to.getBoundingClientRect();
      const fromCenter = { x: (fromBox.left - wallBox.left + fromBox.width / 2) / scale, y: (fromBox.top - wallBox.top + fromBox.height / 2) / scale };
      const toCenter = { x: (toBox.left - wallBox.left + toBox.width / 2) / scale, y: (toBox.top - wallBox.top + toBox.height / 2) / scale };
      setPoints({ from: edgePoint(fromCenter, toCenter, fromBox.width / scale, fromBox.height / scale), to: edgePoint(toCenter, fromCenter, toBox.width / scale, toBox.height / scale), width: wall.offsetWidth, height: wall.offsetHeight });
    };
    const update = () => {
      measure();
      if (!reduced) frame = window.requestAnimationFrame(update);
    };
    update();
    return () => window.cancelAnimationFrame(frame);
  }, [communication, reduced, scale, tileRefs, wallRef]);

  if (!points) return null;
  return <svg className="communication-link" viewBox={`0 0 ${points.width} ${points.height}`} preserveAspectRatio="none" aria-hidden="true">
    <line className="communication-line-glow" x1={points.from.x} y1={points.from.y} x2={points.to.x} y2={points.to.y} />
    <line className="communication-line" x1={points.from.x} y1={points.from.y} x2={points.to.x} y2={points.to.y} />
    <circle className="communication-node" cx={points.from.x} cy={points.from.y} r="2.6" />
    <circle className="communication-node" cx={points.to.x} cy={points.to.y} r="2.6" />
  </svg>;
}
