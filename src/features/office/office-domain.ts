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

function eventFor(snapshot: OfficeSnapshot, input: Omit<OfficeEvent, "id" | "occurredAt">, now: Date) {
  return { ...input, id: `${snapshot.runId}-${now.getTime()}-${snapshot.events.length}`, occurredAt: now.toISOString() };
}

export function createOfficeSnapshot(now = new Date()): OfficeSnapshot {
  return {
    runId: "office-local-run",
    title: "Campanha de lançamento",
    brief: "Preparar a primeira publicação da semana com texto, revisão e entrega rastreável.",
    state: "empty",
    phase: "entrada",
    source: "Solicitação do workspace",
    responsible: "Marina Social",
    updatedAt: now.toISOString(),
    nextStep: "Iniciar a execução para abrir o checkpoint",
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
      return { ...base, state: "working", phase: "trabalho", responsible: "Marina Social", nextStep: "Montar o plano e encaminhar o texto", checkpoint: "brief-confirmado", events: [eventFor(base, { type: "run.started", source: "Você", responsible: "Marina Social", message: "A execução foi iniciada com o brief confirmado.", impact: "Fila do líder aberta", nextStep: "Montar o plano de publicação" }, now), ...snapshot.events] };
    case "REQUEST_USER":
      if (snapshot.state !== "working") return snapshot;
      return { ...base, state: "WAITING_USER", phase: "decisao", nextStep: "Responder qual público deve receber prioridade", checkpoint: "audience-choice", events: [eventFor(base, { type: "run.waiting_user", source: "Marina Social", responsible: "Você", message: "Falta confirmar o público prioritário.", impact: "Execução pausada com checkpoint salvo", nextStep: "Responder para liberar o líder" }, now), ...snapshot.events] };
    case "ANSWER_USER":
      if (snapshot.state !== "WAITING_USER") return snapshot;
      return { ...base, state: "working", phase: "trabalho", nextStep: "Finalizar o plano e preparar o texto", checkpoint: action.answer?.trim() || "audience-confirmed", events: [eventFor(base, { type: "run.resumed", source: "Você", responsible: "Marina Social", message: "A resposta foi registrada e o checkpoint foi retomado.", impact: "Execução liberada", nextStep: "Finalizar o plano" }, now), ...snapshot.events] };
    case "REQUEST_APPROVAL":
      if (snapshot.state !== "working") return snapshot;
      return { ...base, state: "WAITING_APPROVAL", phase: "decisao", nextStep: "Revisar e aprovar o pacote antes da entrega", checkpoint: "human-approval", events: [eventFor(base, { type: "run.waiting_approval", source: "Marina Social", responsible: "Você", message: "O pacote está pronto para aprovação humana.", impact: "Envio protegido até a decisão", nextStep: "Aprovar ou pedir revisão" }, now), ...snapshot.events] };
    case "APPROVE":
      if (snapshot.state !== "WAITING_APPROVAL") return snapshot;
      return { ...base, state: "working", phase: "entrega", nextStep: "Publicar a entrega no armazenamento do workspace", checkpoint: "approval-approved", events: [eventFor(base, { type: "run.resumed", source: "Você", responsible: "Marina Social", message: "A aprovação humana foi registrada.", impact: "Entrega liberada", nextStep: "Registrar a entrega" }, now), ...snapshot.events] };
    case "REJECT":
      if (snapshot.state !== "WAITING_APPROVAL") return snapshot;
      return { ...base, state: "error", phase: "decisao", nextStep: "Revisar o pacote e solicitar uma nova versão", checkpoint: "approval-rejected", events: [eventFor(base, { type: "run.failed", source: "Você", responsible: "Marina Social", message: "A aprovação foi recusada e a entrega foi protegida.", impact: "Nenhum envio foi realizado", nextStep: "Revisar o pacote" }, now), ...snapshot.events] };
    case "COMPLETE":
      if (snapshot.state !== "working" || snapshot.checkpoint !== "approval-approved") return snapshot;
      return { ...base, state: "success", phase: "entrega", nextStep: "Acompanhar o próximo pedido no canvas", checkpoint: "delivery-ready", delivery: { ...snapshot.delivery, status: "ready" }, events: [eventFor(base, { type: "run.completed", source: "Deskverse", responsible: "Marina Social", message: "A entrega foi registrada com sucesso.", impact: "Pacote disponível para consulta", nextStep: "Acompanhar o próximo pedido" }, now), ...snapshot.events] };
    case "FAIL":
      if (snapshot.state !== "working") return snapshot;
      return { ...base, state: "error", phase: "trabalho", nextStep: "Tentar novamente após conferir o checkpoint", checkpoint: "technical-failure", events: [eventFor(base, { type: "run.failed", source: "QueueBackend", responsible: "Plataforma", message: action.message ?? "A execução encontrou uma falha técnica recuperável.", impact: "Nenhum estado parcial foi perdido", nextStep: "Tentar novamente" }, now), ...snapshot.events] };
    case "RETRY":
      if (snapshot.state !== "error") return snapshot;
      return { ...base, state: "working", phase: "trabalho", nextStep: "Retomar a partir do último checkpoint", events: [eventFor(base, { type: "run.resumed", source: "Você", responsible: "Plataforma", message: "A execução foi colocada novamente na fila.", impact: "Retry idempotente solicitado", nextStep: "Retomar checkpoint" }, now), ...snapshot.events] };
    case "CLEAR":
      return { ...createOfficeSnapshot(now), runId: `${snapshot.runId}-next`, events: [eventFor(snapshot, { type: "run.reset", source: "Você", responsible: "Marina Social", message: "Um novo checkpoint foi preparado.", impact: "Fluxo pronto para nova execução", nextStep: "Iniciar a execução" }, now)] };
  }
}

export function officeStateLabel(state: OfficeRunState) {
  return state === "empty" ? "Pronto" : state === "loading" ? "Carregando" : state === "working" ? "Trabalhando" : state === "WAITING_USER" ? "Aguardando você" : state === "WAITING_APPROVAL" ? "Aguardando aprovação" : state === "success" ? "Concluído" : "Falha recuperável";
}
