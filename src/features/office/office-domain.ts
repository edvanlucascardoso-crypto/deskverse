export type OfficeRunState = "empty" | "loading" | "working" | "WAITING_USER" | "WAITING_APPROVAL" | "success" | "error";
export type OfficePhase = "entrada" | "trabalho" | "decisao" | "entrega";

export type OfficeEvent = {
  id: string;
  occurredAt: string;
  type: "run.started" | "run.waiting_user" | "run.waiting_approval" | "run.resumed" | "run.completed" | "run.failed" | "run.reset";
  source: string;
  responsible: string;
  message: string;
  impact: string;
  nextStep: string;
};

export type OfficeSnapshot = {
  runId: string;
  title: string;
  brief: string;
  state: OfficeRunState;
  phase: OfficePhase;
  source: string;
  responsible: string;
  updatedAt: string;
  nextStep: string;
  checkpoint: string | null;
  delivery: { label: string; status: "pending" | "ready" };
  events: OfficeEvent[];
};

export type OfficeWorkspaceState = {
  activeRunId: string | null;
  runs: OfficeSnapshot[];
};

export type OfficeAction =
  | { type: "START" }
  | { type: "REQUEST_USER" }
  | { type: "ANSWER_USER"; answer?: string }
  | { type: "REQUEST_APPROVAL" }
  | { type: "APPROVE" }
  | { type: "REJECT" }
  | { type: "COMPLETE" }
  | { type: "FAIL"; message?: string }
  | { type: "RETRY" }
  | { type: "CLEAR" };

const phaseLabels: Record<OfficePhase, string> = { entrada: "Entrada", trabalho: "Trabalho", decisao: "Decisão", entrega: "Entrega" };
export const officePhaseLabels = phaseLabels;

const checkpointLabels: Record<string, string> = {
  "brief-confirmado": "pedido confirmado",
  "audience-choice": "informação pendente",
  "audience-confirmed": "informação recebida",
  "human-approval": "aprovação pendente",
  "approval-rejected": "ajustes solicitados",
  "approval-approved": "aprovação registrada",
  "delivery-ready": "entrega pronta",
  "technical-failure": "erro técnico",
};

export function officeCheckpointLabel(checkpoint: string | null) {
  return checkpoint ? checkpointLabels[checkpoint] ?? checkpoint : "aberto";
}

function eventFor(snapshot: OfficeSnapshot, input: Omit<OfficeEvent, "id" | "occurredAt">, now: Date) {
  return { ...input, id: `${snapshot.runId}-${now.getTime()}-${snapshot.events.length}`, occurredAt: now.toISOString() };
}

export function createOfficeSnapshot(now = new Date(), runId = `office-local-run-${now.getTime()}`): OfficeSnapshot {
  return {
    runId,
    title: "Campanha de lançamento",
    brief: "Preparar a primeira publicação da semana com texto, revisão e entrega rastreável.",
    state: "empty",
    phase: "entrada",
    source: "Solicitação do workspace",
    responsible: "Marina Social",
    updatedAt: now.toISOString(),
    nextStep: "Começar o trabalho para abrir o pedido",
    checkpoint: null,
    delivery: { label: "Pacote de publicação", status: "pending" },
    events: [],
  };
}

export function reduceOfficeSnapshot(snapshot: OfficeSnapshot, action: OfficeAction, now = new Date()): OfficeSnapshot {
  const base = { ...snapshot, updatedAt: now.toISOString() };
  switch (action.type) {
    case "START":
      if (snapshot.state !== "empty") return snapshot;
      return { ...base, state: "working", phase: "trabalho", responsible: "Marina Social", nextStep: "Montar o plano e encaminhar o texto", checkpoint: "brief-confirmado", events: [eventFor(base, { type: "run.started", source: "Você", responsible: "Marina Social", message: "O trabalho começou com o pedido confirmado.", impact: "Marina começou a trabalhar", nextStep: "Montar o plano de publicação" }, now), ...snapshot.events] };
    case "REQUEST_USER":
      if (snapshot.state !== "working") return snapshot;
      return { ...base, state: "WAITING_USER", phase: "decisao", nextStep: "Responder qual público deve receber prioridade", checkpoint: "audience-choice", events: [eventFor(base, { type: "run.waiting_user", source: "Marina Social", responsible: "Você", message: "Falta confirmar o público prioritário.", impact: "Trabalho pausado; ponto salvo", nextStep: "Responder para continuar" }, now), ...snapshot.events] };
    case "ANSWER_USER":
      if (snapshot.state !== "WAITING_USER") return snapshot;
      return { ...base, state: "working", phase: "trabalho", nextStep: "Finalizar o plano e preparar o texto", checkpoint: action.answer?.trim() || "audience-confirmed", events: [eventFor(base, { type: "run.resumed", source: "Você", responsible: "Marina Social", message: "Sua resposta foi registrada e o trabalho continuou.", impact: "Trabalho liberado", nextStep: "Finalizar o plano" }, now), ...snapshot.events] };
    case "REQUEST_APPROVAL":
      if (snapshot.state !== "working") return snapshot;
      return { ...base, state: "WAITING_APPROVAL", phase: "decisao", nextStep: "Revisar e aprovar o material antes da entrega", checkpoint: "human-approval", events: [eventFor(base, { type: "run.waiting_approval", source: "Marina Social", responsible: "Você", message: "O material está pronto para sua aprovação.", impact: "Nenhum envio será feito antes da decisão", nextStep: "Aprovar ou pedir ajustes" }, now), ...snapshot.events] };
    case "APPROVE":
      if (snapshot.state !== "WAITING_APPROVAL") return snapshot;
      return { ...base, state: "working", phase: "entrega", nextStep: "Confirmar a entrega no workspace", checkpoint: "approval-approved", events: [eventFor(base, { type: "run.resumed", source: "Você", responsible: "Marina Social", message: "Sua aprovação foi registrada.", impact: "A entrega foi liberada", nextStep: "Confirmar a entrega" }, now), ...snapshot.events] };
    case "REJECT":
      if (snapshot.state !== "WAITING_APPROVAL") return snapshot;
      return { ...base, state: "error", phase: "decisao", nextStep: "Revisar o material e pedir uma nova versão", checkpoint: "approval-rejected", events: [eventFor(base, { type: "run.failed", source: "Você", responsible: "Marina Social", message: "Você pediu ajustes antes da entrega.", impact: "Nenhum envio foi feito", nextStep: "Revisar o material" }, now), ...snapshot.events] };
    case "COMPLETE":
      if (snapshot.state !== "working" || snapshot.checkpoint !== "approval-approved") return snapshot;
      return { ...base, state: "success", phase: "entrega", nextStep: "Acompanhar o próximo pedido no canvas", checkpoint: "delivery-ready", delivery: { ...snapshot.delivery, status: "ready" }, events: [eventFor(base, { type: "run.completed", source: "Deskverse", responsible: "Marina Social", message: "A entrega foi registrada com sucesso.", impact: "Pacote disponível para consulta", nextStep: "Acompanhar o próximo pedido" }, now), ...snapshot.events] };
    case "FAIL":
      if (snapshot.state !== "working") return snapshot;
      return { ...base, state: "error", phase: "trabalho", nextStep: "Tentar novamente após conferir o ponto salvo", checkpoint: "technical-failure", events: [eventFor(base, { type: "run.failed", source: "QueueBackend", responsible: "Plataforma", message: action.message ?? "O trabalho encontrou um erro técnico recuperável.", impact: "Nenhuma informação parcial foi perdida", nextStep: "Tentar novamente" }, now), ...snapshot.events] };
    case "RETRY":
      if (snapshot.state !== "error") return snapshot;
      return { ...base, state: "working", phase: "trabalho", nextStep: "Continuar a partir do último ponto salvo", events: [eventFor(base, { type: "run.resumed", source: "Você", responsible: "Plataforma", message: "O trabalho será retomado.", impact: "Nova tentativa solicitada", nextStep: "Continuar do ponto salvo" }, now), ...snapshot.events] };
    case "CLEAR":
      return { ...createOfficeSnapshot(now), runId: `${snapshot.runId}-next`, events: [eventFor(snapshot, { type: "run.reset", source: "Você", responsible: "Marina Social", message: "Um novo ponto de partida foi preparado.", impact: "Pedido pronto para novo trabalho", nextStep: "Iniciar o trabalho" }, now)] };
  }
}

export function officeStateLabel(state: OfficeRunState) {
  return state === "empty" ? "Não iniciado" : state === "loading" ? "Carregando" : state === "working" ? "Em andamento" : state === "WAITING_USER" ? "Aguardando sua resposta" : state === "WAITING_APPROVAL" ? "Aguardando sua aprovação" : state === "success" ? "Concluído" : "Erro recuperável";
}
