import type { CreateOfficeRunInput, OfficeAction, OfficeApproval, OfficeApprovalState, OfficeEvent, OfficePhase, OfficeRunState, OfficeSnapshot } from "@/types/office";

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
  "run-cancelled": "pedido cancelado",
};

export function officeCheckpointLabel(checkpoint: string | null) {
  return checkpoint ? checkpointLabels[checkpoint] ?? checkpoint : "aberto";
}

function eventFor(snapshot: OfficeSnapshot, input: Omit<OfficeEvent, "id" | "occurredAt" | "runId">, now: Date) {
  return { ...input, runId: snapshot.runId, id: `${snapshot.runId}-${now.getTime()}-${snapshot.events.length}`, occurredAt: now.toISOString() };
}

export function createOfficeSnapshot(now = new Date(), runId = `office-local-run-${now.getTime()}`, input?: CreateOfficeRunInput): OfficeSnapshot {
  return {
    runId,
    title: input?.title.trim() || "Campanha de lançamento",
    brief: input?.objective.trim() || "Preparar a primeira publicação da semana com texto, revisão e entrega rastreável.",
    leaderId: input?.leaderId?.trim() || "social",
    parameters: input?.parameters?.trim() || "",
    state: "empty",
    phase: "entrada",
    source: "Solicitação do workspace",
    responsible: input?.leaderName?.trim() || "Marina Social",
    updatedAt: now.toISOString(),
    notes: input?.notes?.trim() || "",
    nextStep: "Começar o trabalho para abrir o pedido",
    checkpoint: null,
    delivery: { label: input?.delivery.trim() || "Pacote de publicação", status: "pending" },
    approvals: [],
    events: [],
  };
}

function newApproval(snapshot: OfficeSnapshot): OfficeApproval {
  const id = `${snapshot.runId}-approval-${snapshot.approvals.length + 1}`;
  return {
    id,
    title: "Pacote de publicação",
    summary: "Confira o material preparado antes que qualquer envio seja feito.",
    reason: "A entrega altera um material que só deve avançar com sua decisão.",
    requestedBy: snapshot.responsible,
    required: true,
    order: snapshot.approvals.length,
    artifacts: [{ id: `${snapshot.runId}-delivery-${snapshot.approvals.length + 1}`, label: snapshot.delivery.label, version: "v1", type: "pacote" }],
    state: "pending",
  };
}

function pendingApprovals(approvals: OfficeApproval[]) {
  return approvals.filter((approval) => approval.state === "pending" && approval.required);
}

function decideApproval(snapshot: OfficeSnapshot, approvalId: string | undefined, state: OfficeApprovalState, decision: string | undefined, now: Date) {
  const target = approvalId ? snapshot.approvals.find((approval) => approval.id === approvalId) : snapshot.approvals.find((approval) => approval.state === "pending");
  if (!target) return { approvals: snapshot.approvals, target: null };
  return {
    target,
    approvals: snapshot.approvals.map((approval) => approval.id === target.id ? { ...approval, state, decision, decidedAt: now.toISOString() } : approval),
  };
}

export function reduceOfficeSnapshot(snapshot: OfficeSnapshot, action: OfficeAction, now = new Date()): OfficeSnapshot {
  const base = { ...snapshot, updatedAt: now.toISOString() };
  switch (action.type) {
    case "START":
      if (snapshot.state !== "empty") return snapshot;
      return { ...base, state: "working", phase: "trabalho", nextStep: "Montar o plano e encaminhar o texto", checkpoint: "brief-confirmado", events: [eventFor(base, { type: "run.started", source: "Você", responsible: snapshot.responsible, message: "O trabalho começou com o pedido confirmado.", impact: `${snapshot.responsible} começou a trabalhar`, nextStep: "Montar o plano de publicação" }, now), ...snapshot.events] };
    case "REQUEST_USER":
      if (snapshot.state !== "working") return snapshot;
      return { ...base, state: "WAITING_USER", phase: "decisao", nextStep: "Responder qual público deve receber prioridade", checkpoint: "audience-choice", events: [eventFor(base, { type: "run.waiting_user", source: snapshot.responsible, responsible: "Você", message: "Falta confirmar o público prioritário.", impact: "Trabalho pausado; ponto salvo", nextStep: "Responder para continuar" }, now), ...snapshot.events] };
    case "ANSWER_USER":
      if (snapshot.state !== "WAITING_USER") return snapshot;
      return { ...base, state: "working", phase: "trabalho", nextStep: "Finalizar o plano e preparar o texto", checkpoint: action.answer?.trim() || "audience-confirmed", events: [eventFor(base, { type: "run.resumed", source: "Você", responsible: snapshot.responsible, message: "Sua resposta foi registrada e o trabalho continuou.", impact: "Trabalho liberado", nextStep: "Finalizar o plano" }, now), ...snapshot.events] };
    case "REQUEST_APPROVAL":
      if (snapshot.state !== "working") return snapshot;
      {
        const approval = newApproval(snapshot);
        return { ...base, state: "WAITING_APPROVAL", phase: "decisao", nextStep: "Revisar cada item pendente antes da entrega", checkpoint: "human-approval", approvals: [...snapshot.approvals, approval], events: [eventFor(base, { type: "run.waiting_approval", source: snapshot.responsible, responsible: "Você", message: "O material está pronto para sua aprovação.", impact: "Nenhum envio será feito antes da decisão", nextStep: "Revisar cada item pendente", approvalId: approval.id, approval, artifact: approval.artifacts[0] }, now), ...snapshot.events] };
      }
    case "APPROVE":
      if (snapshot.state !== "WAITING_APPROVAL") return snapshot;
      {
        const decision = decideApproval(snapshot, action.approvalId, "approved", "Aprovado", now);
        if (!decision.target) return snapshot;
        const hasPending = pendingApprovals(decision.approvals).length > 0;
        return { ...base, state: hasPending ? "WAITING_APPROVAL" : "working", phase: hasPending ? "decisao" : "entrega", nextStep: hasPending ? "Revisar os demais itens pendentes" : "Confirmar a entrega no workspace", checkpoint: hasPending ? "human-approval" : "approval-approved", approvals: decision.approvals, events: [eventFor(base, { type: "approval.decided", source: "Você", responsible: snapshot.responsible, message: hasPending ? "Uma aprovação foi registrada; ainda há itens pendentes." : "Sua aprovação foi registrada.", impact: hasPending ? "O trabalho continua pausado até as outras decisões" : "A entrega foi liberada", nextStep: hasPending ? "Revisar os demais itens pendentes" : "Confirmar a entrega", approvalId: decision.target.id, conversationId: decision.target.conversationId }, now), ...snapshot.events] };
      }
    case "REJECT":
      if (snapshot.state !== "WAITING_APPROVAL") return snapshot;
      {
        const decision = decideApproval(snapshot, action.approvalId, "changes_requested", action.decision ?? "Ajustes solicitados", now);
        if (!decision.target) return snapshot;
        return { ...base, state: "error", phase: "decisao", nextStep: "Revisar o material e pedir uma nova versão", checkpoint: "approval-rejected", approvals: decision.approvals, events: [eventFor(base, { type: "approval.decided", source: "Você", responsible: snapshot.responsible, message: "Você pediu ajustes antes da entrega.", impact: "Nenhum envio foi feito", nextStep: "Revisar o material", approvalId: decision.target.id, conversationId: decision.target.conversationId }, now), ...snapshot.events] };
      }
    case "COMPLETE":
      if (snapshot.state !== "working" || snapshot.checkpoint !== "approval-approved") return snapshot;
      return { ...base, state: "success", phase: "entrega", nextStep: "Acompanhar o próximo pedido no canvas", checkpoint: "delivery-ready", delivery: { ...snapshot.delivery, status: "ready" }, events: [eventFor(base, { type: "run.completed", source: "Deskverse", responsible: snapshot.responsible, message: "A entrega foi registrada com sucesso.", impact: "Pacote disponível para consulta", nextStep: "Acompanhar o próximo pedido" }, now), ...snapshot.events] };
    case "FAIL":
      if (snapshot.state !== "working") return snapshot;
      return { ...base, state: "error", phase: "trabalho", nextStep: "Tentar novamente após conferir o ponto salvo", checkpoint: "technical-failure", events: [eventFor(base, { type: "run.failed", source: "QueueBackend", responsible: "Plataforma", message: action.message ?? "O trabalho encontrou um erro técnico recuperável.", impact: "Nenhuma informação parcial foi perdida", nextStep: "Tentar novamente" }, now), ...snapshot.events] };
    case "RETRY":
      if (snapshot.state !== "error") return snapshot;
      return { ...base, state: "working", phase: "trabalho", nextStep: "Continuar a partir do último ponto salvo", events: [eventFor(base, { type: "run.resumed", source: "Você", responsible: snapshot.responsible, message: "O trabalho será retomado.", impact: "Nova tentativa solicitada", nextStep: "Continuar do ponto salvo" }, now), ...snapshot.events] };
    case "CANCEL":
      if (snapshot.state === "success" || snapshot.state === "cancelled") return snapshot;
      return { ...base, state: "cancelled", phase: snapshot.phase, nextStep: "Nenhuma nova etapa será iniciada neste pedido", checkpoint: "run-cancelled", approvals: snapshot.approvals.map((approval) => approval.state === "pending" ? { ...approval, state: "cancelled", decidedAt: now.toISOString() } : approval), events: [eventFor(base, { type: "run.cancelled", source: "Você", responsible: snapshot.responsible, message: "O pedido foi cancelado.", impact: "Nenhum novo trabalho será iniciado", nextStep: "Criar um novo pedido quando quiser" }, now), ...snapshot.events] };
    case "CLEAR":
      return { ...createOfficeSnapshot(now), runId: `${snapshot.runId}-next`, events: [eventFor(snapshot, { type: "run.reset", source: "Você", responsible: snapshot.responsible, message: "Um novo ponto de partida foi preparado.", impact: "Pedido pronto para novo trabalho", nextStep: "Iniciar o trabalho" }, now)] };
  }
}

export function officeStateLabel(state: OfficeRunState) {
  return state === "empty" ? "Não iniciado" : state === "loading" ? "Carregando" : state === "working" ? "Em andamento" : state === "WAITING_USER" ? "Aguardando sua resposta" : state === "WAITING_APPROVAL" ? "Aguardando sua aprovação" : state === "success" ? "Concluído" : state === "cancelled" ? "Cancelado" : "Erro recuperável";
}

export function officeApprovalStateLabel(state: OfficeApprovalState) {
  return state === "pending" ? "Aguardando decisão" : state === "approved" ? "Aprovada" : state === "changes_requested" ? "Ajustes solicitados" : state === "rejected" ? "Rejeitada" : state === "cancelled" ? "Cancelada" : "Expirada";
}
