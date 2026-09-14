"use client";

import { BellRing, CheckCircle2, CircleAlert, Handshake, Layers3, MousePointer2, Play, RotateCcw, Sparkles, Timer, WandSparkles } from "lucide-react";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { canvasAnimationLabels, type CanvasAnimationKind } from "./canvas-animation-events";

type CanvasAnimationDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSelect: (kind: CanvasAnimationKind) => void;
};

const actions: Array<{ kind: CanvasAnimationKind; icon: typeof Play; description: string }> = [
  { kind: "entrada", icon: Sparkles, description: "Entrada suave de toda a grade." },
  { kind: "selecionar", icon: MousePointer2, description: "Foco e halo de um agente." },
  { kind: "reflow", icon: Layers3, description: "Reorganização temporária dos slots." },
  { kind: "comunicacao", icon: Handshake, description: "Conexão, pulso e aproximação entre dois agentes." },
  { kind: "trabalhando", icon: Play, description: "Atividade e halo discreto." },
  { kind: "aguardando", icon: Timer, description: "Espera por decisão humana." },
  { kind: "concluido", icon: CheckCircle2, description: "Conclusão com confirmação visual." },
  { kind: "erro", icon: CircleAlert, description: "Falha visível e recuperável." },
  { kind: "notificacao", icon: BellRing, description: "Pulso do sino e novo aviso." },
  { kind: "limpar", icon: RotateCcw, description: "Retorna a demonstração ao estado neutro." },
];

export function CanvasAnimationDrawer({ open, setOpen, onSelect }: CanvasAnimationDrawerProps) {
  const choose = (kind: CanvasAnimationKind) => {
    setOpen(false);
    window.setTimeout(() => onSelect(kind), 220);
  };

  return <Drawer open={open} onOpenChange={setOpen}><DrawerContent scrollable className="animation-drawer"><DrawerHeader><DrawerDescription><WandSparkles size={14} /> Testes temporários</DrawerDescription><DrawerTitle>Animações do canvas</DrawerTitle></DrawerHeader><p className="animation-drawer-intro">Escolha uma interação. O painel fecha antes da animação começar.</p><div className="animation-action-list">{actions.map(({ kind, icon: Icon, description }) => <button key={kind} type="button" className="animation-action" onClick={() => choose(kind)}><span><Icon size={18} strokeWidth={1.5} /></span><p><strong>{canvasAnimationLabels[kind]}</strong><small>{description}</small></p></button>)}</div></DrawerContent></Drawer>;
}
