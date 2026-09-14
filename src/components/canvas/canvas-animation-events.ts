export type CanvasAnimationKind =
  | "entrada"
  | "selecionar"
  | "reflow"
  | "comunicacao"
  | "trabalhando"
  | "aguardando"
  | "concluido"
  | "erro"
  | "notificacao"
  | "limpar";

export type CanvasAnimationEvent = {
  id: number;
  kind: CanvasAnimationKind;
  actorId?: string;
  targetId?: string;
};

export const canvasAnimationLabels: Record<CanvasAnimationKind, string> = {
  entrada: "Entrada dos agentes",
  selecionar: "Selecionar agente",
  reflow: "Reorganizar grade",
  comunicacao: "Comunicação entre agentes",
  trabalhando: "Agente trabalhando",
  aguardando: "Aguardando decisão",
  concluido: "Tarefa concluída",
  erro: "Falha do agente",
  notificacao: "Nova notificação",
  limpar: "Limpar estado de teste",
};
