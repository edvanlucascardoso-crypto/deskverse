"use client";

import { BookOpenText } from "lucide-react";

export function KnowledgeLauncher({ onOpen }: { onOpen: () => void }) {
  return <button className="canvas-knowledge-launcher canvas-icon-button" type="button" onClick={onOpen} aria-label="Abrir base de conhecimento" title="Abrir base de conhecimento"><BookOpenText size={17} /></button>;
}
