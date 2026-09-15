import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  CalendarDays,
  ClipboardList,
  Headphones,
  HeartHandshake,
  LayoutGrid,
  Lightbulb,
  Megaphone,
  MessageCircle,
  Receipt,
  ShoppingCart,
  UserRound,
  Workflow,
} from "lucide-react";

export type CanvasState = "success" | "loading" | "empty" | "error";
export type AgentActivity = "idle" | "working" | "communicating" | "waiting" | "blocked" | "paused" | "completed" | "unknown" | "error";
export type AgentCommunication = { fromId: string; toId: string };
export type AgentKind = "leader" | "specialist";
export type Seniority = "Júnior" | "Pleno" | "Sênior" | "Especialista";
export type CapabilityPreference = { capability: string; seniority: Seniority };

export type Agent = {
  id: string;
  name: string;
  role: string;
  taskSummary: string;
  icon: LucideIcon;
  color: string;
  activity: AgentActivity;
  detail: string;
  kind: AgentKind;
  seniority: Seniority;
  capabilities?: CapabilityPreference[];
  queueSummary?: string;
  nextAction?: string;
  updatedAt?: string;
  source?: string;
};

export type Activity = {
  id: string;
  text: string;
  time: string;
  tone: string;
  origin: string;
  impact: string;
  agentId: string;
  relatedLabel: string;
  officeRunId?: string;
};

export type ConversationKind = "global" | "private" | "meeting";
export type MessageStatus = "sending" | "sent" | "failed";
export type ConversationMessage = {
  id: string;
  kind: ConversationKind;
  authorId: string;
  targetId?: string;
  text: string;
  time: string;
  status: MessageStatus;
  origin: string;
  activityId?: string;
  relatedLabel?: string;
};

const local = { source: "Dados locais", updatedAt: "agora" };

export const agents: Agent[] = [
  { id: "social", name: "Marina Social", role: "Mídias Sociais", taskSummary: "Criando calendário", icon: MessageCircle, color: "#46d3c2", activity: "working", detail: "Preparando o calendário editorial.", kind: "leader", seniority: "Sênior", capabilities: [{ capability: "Pesquisa", seniority: "Júnior" }, { capability: "Redação", seniority: "Sênior" }, { capability: "Design", seniority: "Pleno" }], nextAction: "Revisar a pauta de terça", ...local },
  { id: "manager", name: "Nico Gestor", role: "Operações", taskSummary: "Aguardando resposta", icon: LayoutGrid, color: "#A5A8B0", activity: "waiting", detail: "Aguardando uma decisão sua.", kind: "leader", seniority: "Pleno", capabilities: [{ capability: "Pesquisa", seniority: "Pleno" }, { capability: "Revisão", seniority: "Júnior" }, { capability: "Análise", seniority: "Pleno" }], nextAction: "Confirmar prioridade do dia", ...local },
  { id: "projects", name: "Sofia Projetos", role: "Projetos", taskSummary: "Mapeando próximos passos", icon: Briefcase, color: "#52cdbd", activity: "idle", detail: "Organizando objetivos e dependências do projeto.", kind: "leader", seniority: "Sênior", capabilities: [{ capability: "Planejamento", seniority: "Sênior" }, { capability: "Operações", seniority: "Pleno" }], nextAction: "Abrir a próxima frente", ...local },
  { id: "content", name: "Ana Conteúdo", role: "Conteúdo", taskSummary: "Pauta concluída", icon: ClipboardList, color: "#5bcfbe", activity: "completed", detail: "A pauta de segunda está pronta para aprovação.", kind: "leader", seniority: "Pleno", capabilities: [{ capability: "Redação", seniority: "Sênior" }, { capability: "Pesquisa", seniority: "Pleno" }], nextAction: "Aguardar aprovação", ...local },
  { id: "commercial", name: "Clara Comercial", role: "Comercial", taskSummary: "Qualificando leads", icon: ShoppingCart, color: "#4bc7b7", activity: "working", detail: "Qualificando oportunidades e próximos contatos.", kind: "leader", seniority: "Pleno", capabilities: [{ capability: "Vendas", seniority: "Pleno" }, { capability: "Pesquisa", seniority: "Júnior" }], nextAction: "Priorizar contatos quentes", ...local },
  { id: "finance", name: "Theo Financeiro", role: "Financeiro", taskSummary: "Bloqueado por aprovação", icon: Receipt, color: "#a7acb5", activity: "blocked", detail: "Há uma despesa aguardando confirmação.", kind: "leader", seniority: "Sênior", capabilities: [{ capability: "Finanças", seniority: "Sênior" }, { capability: "Análise", seniority: "Pleno" }], nextAction: "Solicitar aprovação", ...local },
  { id: "support", name: "Bruno Atendimento", role: "Atendimento", taskSummary: "Respondendo clientes", icon: Headphones, color: "#53cebe", activity: "working", detail: "Respondendo clientes e encaminhando pedidos.", kind: "leader", seniority: "Pleno", capabilities: [{ capability: "Atendimento", seniority: "Sênior" }, { capability: "Operações", seniority: "Júnior" }], nextAction: "Retornar os contatos pendentes", ...local },
  { id: "calendar", name: "Lia Agenda", role: "Agenda", taskSummary: "Ajustando compromissos", icon: CalendarDays, color: "#55cbbb", activity: "idle", detail: "Ajustando compromissos e conflitos de agenda.", kind: "leader", seniority: "Pleno", capabilities: [{ capability: "Agenda", seniority: "Pleno" }, { capability: "Operações", seniority: "Júnior" }], nextAction: "Confirmar a agenda de amanhã", ...local },
  { id: "relationship", name: "Júlia Relacionamento", role: "Relacionamento", taskSummary: "Cuidando da comunidade", icon: HeartHandshake, color: "#4cc8b8", activity: "idle", detail: "Acompanhando sinais importantes da comunidade.", kind: "leader", seniority: "Sênior", capabilities: [{ capability: "Atendimento", seniority: "Pleno" }, { capability: "Conteúdo", seniority: "Pleno" }], nextAction: "Ler os retornos recentes", ...local },
  { id: "insights", name: "Rafael Analista", role: "Análise", taskSummary: "Lendo indicadores", icon: Lightbulb, color: "#a6abb4", activity: "working", detail: "Lendo indicadores e destacando oportunidades.", kind: "leader", seniority: "Sênior", capabilities: [{ capability: "Análise", seniority: "Sênior" }, { capability: "Pesquisa", seniority: "Pleno" }], nextAction: "Compartilhar o principal sinal", ...local },
  { id: "planning", name: "Bia Planejamento", role: "Planejamento", taskSummary: "Montando o plano", icon: Workflow, color: "#50cbbb", activity: "idle", detail: "Montando o plano semanal a partir das prioridades.", kind: "leader", seniority: "Pleno", capabilities: [{ capability: "Planejamento", seniority: "Sênior" }, { capability: "Projetos", seniority: "Pleno" }], nextAction: "Definir a sequência", ...local },
  { id: "growth", name: "Diego Crescimento", role: "Crescimento", taskSummary: "Pausado", icon: Megaphone, color: "#4ac6b7", activity: "paused", detail: "Aguardando a próxima janela para testar a hipótese.", kind: "leader", seniority: "Pleno", capabilities: [{ capability: "Marketing", seniority: "Sênior" }, { capability: "Análise", seniority: "Pleno" }], nextAction: "Retomar o experimento", ...local },
  { id: "people", name: "Maya Pessoas", role: "Pessoas", taskSummary: "Sem atualização", icon: UserRound, color: "#a8adb5", activity: "unknown", detail: "Ainda não recebemos uma atualização deste agente.", kind: "leader", seniority: "Sênior", capabilities: [{ capability: "Pessoas", seniority: "Sênior" }, { capability: "Relacionamento", seniority: "Pleno" }], nextAction: "Solicitar contexto", source: "Sem sinal recente", updatedAt: "há 18 min" },
];

export const activities: Activity[] = [
  { id: "activity-1", text: "Marina atualizou o calendário editorial.", time: "agora", tone: "#46d3c2", origin: "Marina Social", impact: "Revisão necessária", agentId: "social", relatedLabel: "Calendário editorial" },
  { id: "activity-2", text: "Nico aguarda uma decisão sua.", time: "há 4 min", tone: "#f4c64e", origin: "Nico Gestor", impact: "Ação pendente", agentId: "manager", relatedLabel: "Prioridades do dia" },
  { id: "activity-3", text: "Ana concluiu a pauta de segunda.", time: "há 12 min", tone: "#5bcfbe", origin: "Ana Conteúdo", impact: "Pronto para aprovar", agentId: "content", relatedLabel: "Pauta de segunda" },
];

export const initialMessages: ConversationMessage[] = [
  { id: "global-0", kind: "global", authorId: "projects", text: "Organizei os próximos marcos do projeto e sinalizei os pontos que precisam de decisão hoje.", time: "09:18", status: "sent", origin: "Canvas", relatedLabel: "Plano do projeto" },
  { id: "global-1", kind: "global", authorId: "social", text: "Calendário editorial atualizado. Preciso da confirmação da pauta de terça.", time: "09:42", status: "sent", origin: "Canvas", activityId: "activity-1", relatedLabel: "Calendário editorial" },
  { id: "global-2", kind: "global", authorId: "manager", text: "Prioridades do dia organizadas. Aguardando sua decisão para seguir.", time: "09:46", status: "sent", origin: "Canvas", activityId: "activity-2", relatedLabel: "Prioridades do dia" },
  { id: "global-3", kind: "global", authorId: "content", text: "A pauta de segunda foi concluída. Deixei a estrutura pronta para a próxima revisão.", time: "09:49", status: "sent", origin: "Canvas", activityId: "activity-3", relatedLabel: "Pauta de segunda" },
  { id: "global-4", kind: "global", authorId: "commercial", text: "Separei os contatos com maior potencial de retorno para a rodada da tarde.", time: "09:53", status: "sent", origin: "Canvas", relatedLabel: "Oportunidades prioritárias" },
  { id: "global-5", kind: "global", authorId: "insights", text: "O principal sinal dos indicadores é a alta procura pelos conteúdos mais práticos.", time: "09:57", status: "sent", origin: "Canvas", relatedLabel: "Resumo de indicadores" },
  { id: "global-6", kind: "global", authorId: "calendar", text: "Reservei uma janela para revisão do plano antes da reunião de amanhã.", time: "10:02", status: "sent", origin: "Canvas", relatedLabel: "Agenda da semana" },
  { id: "global-7", kind: "global", authorId: "planning", text: "A sequência semanal está pronta para receber a confirmação das prioridades.", time: "10:06", status: "sent", origin: "Canvas", relatedLabel: "Plano semanal" },
  { id: "private-1", kind: "private", authorId: "social", targetId: "current-user", text: "Separei duas opções de pauta para terça. Quer que eu priorize a mais educativa?", time: "09:48", status: "sent", origin: "Conversa privada", activityId: "activity-1", relatedLabel: "Calendário editorial" },
  { id: "private-content-1", kind: "private", authorId: "content", targetId: "current-user", text: "Concluí a primeira versão da pauta de segunda e deixei os pontos que ainda precisam de validação destacados.", time: "09:35", status: "sent", origin: "Conversa privada", activityId: "activity-3", relatedLabel: "Pauta de segunda" },
  { id: "private-content-2", kind: "private", authorId: "current-user", targetId: "content", text: "Ótimo. Pode manter o tom mais direto e deixar as alternativas de título juntas?", time: "09:38", status: "sent", origin: "Você" },
  { id: "private-content-3", kind: "private", authorId: "content", targetId: "current-user", text: "Sim. Reorganizei a abertura e reuni três alternativas para facilitar a escolha.", time: "09:41", status: "sent", origin: "Conversa privada", relatedLabel: "Pauta de segunda" },
  { id: "private-content-4", kind: "private", authorId: "content", targetId: "current-user", text: "Também mantive uma versão curta para adaptar ao calendário editorial quando você aprovar.", time: "09:44", status: "sent", origin: "Conversa privada", relatedLabel: "Calendário editorial" },
  { id: "private-content-5", kind: "private", authorId: "current-user", targetId: "content", text: "Perfeito, vou revisar agora e volto com a decisão final.", time: "09:47", status: "sent", origin: "Você" },
  { id: "meeting-1", kind: "meeting", authorId: "projects", text: "Reunião de pauta iniciada. Vamos fechar responsáveis e prazos.", time: "09:50", status: "sent", origin: "Reunião de pauta", relatedLabel: "Planejamento semanal" },
];

export const defaultOrder = agents.map((agent) => agent.id);

export function isActiveActivity(activity: AgentActivity) {
  return activity === "working" || activity === "communicating";
}

export function statusColor(activity: AgentActivity) {
  if (activity === "working" || activity === "communicating") return "var(--status-working)";
  if (activity === "error" || activity === "blocked") return "var(--status-error)";
  if (activity === "waiting") return "var(--status-waiting)";
  if (activity === "paused" || activity === "unknown") return "var(--status-muted)";
  if (activity === "completed") return "var(--status-complete)";
  return "var(--status-available)";
}

export function activityLabel(activity: AgentActivity) {
  if (activity === "communicating") return "Comunicando";
  if (activity === "working") return "Trabalhando";
  if (activity === "error") return "Erro / ajuda";
  if (activity === "waiting") return "Aguardando você";
  if (activity === "blocked") return "Bloqueado";
  if (activity === "paused") return "Pausado";
  if (activity === "completed") return "Concluído";
  if (activity === "unknown") return "Sem atualização";
  return "Disponível";
}
