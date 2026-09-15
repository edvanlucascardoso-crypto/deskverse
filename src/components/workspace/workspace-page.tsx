"use client";

import { AnimatePresence, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { AgentContextPanel } from "@/components/canvas/agent-context-panel";
import { agents, activities, defaultOrder, initialMessages, isActiveActivity, type Activity, type Agent, type AgentActivity, type AgentCommunication, type CanvasState, type ConversationKind, type ConversationMessage } from "@/components/canvas/agent-data";
import { ConversationDrawer } from "@/components/canvas/conversation-drawer";
import { CreateLeaderDialog } from "@/components/canvas/create-leader-dialog";
import { CanvasMenuSheet } from "@/components/canvas/canvas-menu-sheet";
import { CanvasNotificationsDrawer } from "@/components/canvas/canvas-notifications-drawer";
import { CanvasNavbar } from "@/components/canvas/canvas-navbar";
import { CanvasDndProvider } from "@/components/canvas/canvas-dnd-provider";
import { CanvasAnimationDrawer } from "@/components/canvas/canvas-animation-drawer";
import { canvasAnimationLabels, type CanvasAnimationEvent, type CanvasAnimationKind } from "@/components/canvas/canvas-animation-events";
import { WorkspaceCanvas, type AgentEntry } from "@/components/canvas/workspace-canvas";
import { PlatformDrawer } from "@/components/platform/platform-drawer";
import { OfficeControlDrawer } from "@/components/office/office-control-drawer";
import { agentOrderRepository, deviceAgentOrderRepository, mergeAgentOrder, moveAgent } from "@/lib/canvas/agent-order";
import { authClient } from "@/lib/auth-client";
import type { WorkspaceRole } from "@/lib/permissions/rbac";
import { platformWorkspaceRepository } from "@/features/workspace/api-workspace-repository";
import { localWorkspaceRepository } from "@/features/workspace/local-workspace-repository";
import type { WorkspaceSummary } from "@/features/workspace/platform-workspace-repository";
import { officeEventToActivity, officeEventToCanvasActivity } from "@/features/office/office-notifications";
import { useOfficeStore } from "@/features/office/use-office-store";
import type { WorkspaceSnapshot } from "@/features/workspace/workspace-domain";
import { useWorkspaceSnapshot } from "@/features/workspace/use-workspace-snapshot";

type WorkspaceListResponse = { message?: string; workspaces?: Array<{ id: string; role: WorkspaceRole }> };
type WorkspacePageProps = { demoMode?: boolean; initialWorkspace?: WorkspaceSummary | null; initialWorkspaceError?: string | null };
type ActivityInput = Omit<Activity, "id" | "time"> & Partial<Pick<Activity, "id" | "time">>;

function snapshotFromSummary(workspace: WorkspaceSummary): WorkspaceSnapshot {
  return {
    state: "success",
    context: {
      workspaceId: workspace.id,
      organizationId: workspace.organizationId,
      name: workspace.name,
      source: "Prisma / PostgreSQL",
      owner: "Você",
      updatedAt: workspace.updatedAt,
      nextStep: `${workspace.memberCount} pessoas podem acompanhar este espaço`,
    },
    agentOrder: [],
  };
}

export default function WorkspacePage({ demoMode = false, initialWorkspace = null, initialWorkspaceError = null }: WorkspacePageProps) {
  const session = authClient.useSession();
  const authenticatedUserId = session.data?.user?.id ?? null;
  const userId = authenticatedUserId ?? "demo-user";
  const initialSnapshot = useMemo(() => initialWorkspace ? snapshotFromSummary(initialWorkspace) : null, [initialWorkspace]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(initialWorkspace?.id ?? null);
  const [activeRole, setActiveRole] = useState<WorkspaceRole>(initialWorkspace?.role ?? "OWNER");
  const [workspaceBootstrapError, setWorkspaceBootstrapError] = useState<string | null>(initialWorkspaceError);
  const workspaceRepository = useMemo(() => demoMode ? localWorkspaceRepository : platformWorkspaceRepository, [demoMode]);
  const workspaceScopeId = activeWorkspaceId ?? "workspace-demo";
  const orderScope = useMemo(() => ({ workspaceId: workspaceScopeId, userId }), [userId, workspaceScopeId]);
  const workspace = useWorkspaceSnapshot(activeWorkspaceId, workspaceRepository, initialSnapshot);
  const refreshWorkspace = workspace.refresh;
  const [canvasState, setCanvasState] = useState<CanvasState>("success");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"all" | "active" | "available">("all");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [platformOpen, setPlatformOpen] = useState(false);
  const [officeOpen, setOfficeOpen] = useState(false);
  const [conversationOpen, setConversationOpen] = useState(false);
  const [conversationMode, setConversationMode] = useState<ConversationKind>("global");
  const [conversationTargetId, setConversationTargetId] = useState<string | null>("social");
  const [conversationState, setConversationState] = useState<CanvasState>("success");
  const [meetingActive, setMeetingActive] = useState(false);
  const [messages, setMessages] = useState<ConversationMessage[]>(initialMessages);
  const [activityFeed, setActivityFeed] = useState<Activity[]>(activities);
  const [animationDrawerOpen, setAnimationDrawerOpen] = useState(false);
  const [creatorOpen, setCreatorOpen] = useState(false);
  const [customLeaders, setCustomLeaders] = useState<Agent[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [focused, setFocused] = useState("social");
  const [order, setOrder] = useState(defaultOrder);
  const [optimisticOrder, setOptimisticOrder] = useState<string[] | null>(null);
  const [animationOrder, setAnimationOrder] = useState<string[] | null>(null);
  const [zoom, setZoom] = useState(100);
  const [liveActivity, setLiveActivity] = useState<Record<string, AgentActivity>>({});
  const [communication, setCommunication] = useState<AgentCommunication | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [animationEvent, setAnimationEvent] = useState<CanvasAnimationEvent | null>(null);
  const [notificationPulse, setNotificationPulse] = useState(false);
  const dragOriginOrder = useRef<string[] | null>(null);
  const orderRef = useRef(defaultOrder);
  const orderMutation = useRef(0);
  const animationTimers = useRef<number[]>([]);
  const officeNotificationScope = useRef<string | null>(null);
  const officeNotificationEventIds = useRef(new Set<string>());
  const officeNotificationsHydrated = useRef(false);
  const [notice, setNotice] = useState("Canvas sincronizado agora");
  const reduced = useReducedMotion();
  const office = useOfficeStore(workspaceScopeId, orderScope.userId);
  const selectOfficeRun = office.selectRun;

  const changeWorkspace = useCallback((workspaceId: string, role?: WorkspaceRole) => {
    setActiveWorkspaceId(workspaceId);
    setWorkspaceBootstrapError(null);
    if (role) setActiveRole(role);
    orderRef.current = defaultOrder;
    setOrder(defaultOrder);
    setOptimisticOrder(null);
    setNotice("Workspace selecionado");
  }, []);

  const loadUserWorkspace = useCallback(async () => {
    if (!authenticatedUserId) return;
    setWorkspaceBootstrapError(null);
    try {
      const response = await fetch("/api/workspaces", { cache: "no-store" });
      const body = await response.json().catch(() => ({})) as WorkspaceListResponse;
      if (!response.ok) throw new Error(body.message ?? "Não conseguimos carregar seus workspaces agora.");
      const selected = body.workspaces?.[0];
      if (!selected) throw new Error("Sua conta ainda não tem um workspace disponível.");
      changeWorkspace(selected.id, selected.role);
    } catch (error) {
      setWorkspaceBootstrapError(error instanceof Error ? error.message : "Não conseguimos carregar seus workspaces agora.");
    }
  }, [authenticatedUserId, changeWorkspace]);

  useEffect(() => {
    if (demoMode) {
      const timer = window.setTimeout(() => changeWorkspace("workspace-demo"), 0);
      return () => window.clearTimeout(timer);
    }
    if (session.isPending || !authenticatedUserId || initialWorkspace?.id) return;
    const timer = window.setTimeout(() => { void loadUserWorkspace(); }, 0);
    return () => window.clearTimeout(timer);
  }, [authenticatedUserId, changeWorkspace, demoMode, initialWorkspace?.id, loadUserWorkspace, session.isPending]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    let cancelled = false;
    void agentOrderRepository.load(orderScope).then((saved) => {
      if (cancelled || !saved) return;
      const next = mergeAgentOrder(saved.order, defaultOrder);
      orderRef.current = next;
      setOrder(next);
    });
    return () => { cancelled = true; };
  }, [orderScope]);

  const allAgents = useMemo(() => [...agents, ...customLeaders], [customLeaders]);
  const currentActivity = useCallback((id: string) => liveActivity[id] ?? allAgents.find((agent) => agent.id === id)?.activity ?? "idle", [allAgents, liveActivity]);
  const visibleOrder = animationOrder ?? optimisticOrder ?? order;
  const entries = useMemo<AgentEntry[]>(() => visibleOrder.map((id) => allAgents.find((agent) => agent.id === id)).filter((agent): agent is Agent => Boolean(agent)).map((agent) => ({ agent, activity: currentActivity(agent.id) })).filter(({ activity }) => {
    const matchesView = view === "all" || (view === "active" ? isActiveActivity(activity) : activity === "idle" || activity === "waiting");
    return matchesView;
  }), [allAgents, currentActivity, view, visibleOrder]);
  const selectedAgent = allAgents.find((agent) => agent.id === selected) ?? null;
  const addActivity = useCallback((activity: ActivityInput) => {
    setActivityFeed((current) => [{ ...activity, id: activity.id ?? `activity-${Date.now()}`, time: activity.time ?? "agora" }, ...current].slice(0, 8));
  }, []);
  const reorderAgents = useCallback((sourceId: string, targetId: string) => {
    const source = allAgents.find((agent) => agent.id === sourceId);
    const target = allAgents.find((agent) => agent.id === targetId);
    if (!source || !target || source.kind !== target.kind) return;
    const next = moveAgent(orderRef.current, sourceId, targetId);
    if (next === orderRef.current) return;
    orderRef.current = next;
    setOptimisticOrder(next);
  }, [allAgents]);
  const beginAgentDrag = useCallback((id: string) => {
    dragOriginOrder.current = orderRef.current;
    setIsReordering(true);
    setNotice("Reorganizando agentes");
  }, []);
  const commitAgentOrder = useCallback(() => {
    const updatedOrder = orderRef.current;
    const previousOrder = dragOriginOrder.current ?? updatedOrder;
    const mutationId = ++orderMutation.current;
    dragOriginOrder.current = null;
    setIsReordering(false);
    setNotice("Salvando arranjo");
    void agentOrderRepository.save({ ...orderScope, order: updatedOrder, updatedAt: new Date().toISOString() }).then((result) => {
      if (orderMutation.current !== mutationId) return;
      orderRef.current = updatedOrder;
      setOrder(updatedOrder);
      setOptimisticOrder(null);
      setNotice(result.persisted === "server" ? "Arranjo sincronizado" : "Arranjo salvo neste dispositivo");
    }).catch(() => {
      if (orderMutation.current !== mutationId) return;
      orderRef.current = previousOrder;
      setOptimisticOrder(null);
      void deviceAgentOrderRepository.save({ ...orderScope, order: previousOrder, updatedAt: new Date().toISOString() });
      setNotice("Não foi possível salvar; arranjo restaurado");
    });
  }, [orderScope]);
  const cancelAgentOrder = useCallback(() => {
    if (dragOriginOrder.current) {
      orderRef.current = dragOriginOrder.current;
      setOptimisticOrder(null);
    }
    dragOriginOrder.current = null;
    setIsReordering(false);
    setNotice("Arranjo mantido");
  }, []);

  const scheduleAnimationReset = useCallback((callback: () => void, delay: number) => {
    const timer = window.setTimeout(() => {
      callback();
      animationTimers.current = animationTimers.current.filter((item) => item !== timer);
    }, delay);
    animationTimers.current.push(timer);
  }, []);

  useEffect(() => () => animationTimers.current.forEach((timer) => window.clearTimeout(timer)), []);

  useEffect(() => {
    const scope = `${workspaceScopeId}:${orderScope.userId}`;
    if (officeNotificationScope.current !== scope) {
      officeNotificationScope.current = scope;
      officeNotificationEventIds.current = new Set();
      officeNotificationsHydrated.current = false;
    }
    if (office.loading) return;
    if (!officeNotificationsHydrated.current) {
      office.runs.flatMap((run) => run.events).forEach((event) => officeNotificationEventIds.current.add(event.id));
      officeNotificationsHydrated.current = true;
      return;
    }

    const newEvents = office.runs
      .flatMap((run) => run.events.map((event) => ({ event, run })))
      .filter(({ event }) => !officeNotificationEventIds.current.has(event.id))
      .sort((first, second) => new Date(first.event.occurredAt).getTime() - new Date(second.event.occurredAt).getTime());

    if (!newEvents.length) return;
    newEvents.forEach(({ event, run }) => {
      officeNotificationEventIds.current.add(event.id);
      addActivity(officeEventToActivity(event, run));
    });
    const latest = newEvents[newEvents.length - 1].event;
    setLiveActivity((current) => ({ ...current, social: officeEventToCanvasActivity(latest) }));
    setNotice(latest.message);
    setNotificationPulse(true);
    scheduleAnimationReset(() => setNotificationPulse(false), 900);
  }, [addActivity, office.loading, office.runs, orderScope.userId, scheduleAnimationReset, workspaceScopeId]);

  const communicate = useCallback((fromId: string, toId: string) => {
    if (fromId === toId) return;
    setAnimationOrder(moveAgent(visibleOrder, fromId, toId));
    setLiveActivity((current) => ({ ...current, [fromId]: "communicating", [toId]: "communicating" }));
    setCommunication({ fromId, toId });
    setFocused(fromId);
    const source = allAgents.find((agent) => agent.id === fromId)?.name;
    const target = allAgents.find((agent) => agent.id === toId)?.name;
    setNotice(source + " está em comunicação com " + target);
    scheduleAnimationReset(() => {
      setLiveActivity((current) => ({ ...current, [fromId]: "working", [toId]: "idle" }));
      setCommunication((current) => current?.fromId === fromId && current.toId === toId ? null : current);
      setAnimationOrder(null);
    }, 2600);
  }, [allAgents, scheduleAnimationReset, visibleOrder]);

  const openPrivateChat = useCallback((agentId: string) => {
    setConversationTargetId(agentId);
    setConversationMode("private");
    setConversationState("success");
    setSelected(null);
    setConversationOpen(true);
  }, []);

  const startMeeting = useCallback((participantId = selected ?? "manager") => {
    const targetId = participantId === "social" ? "manager" : participantId;
    setMeetingActive(true);
    setConversationMode("meeting");
    setConversationState("success");
    setSelected(null);
    setConversationOpen(true);
    communicate("social", targetId);
    addActivity({ text: "Marina iniciou uma reunião de pauta.", tone: "#46d3c2", origin: "Marina Social", impact: "Reunião em andamento", agentId: "social", relatedLabel: "Planejamento semanal" });
  }, [addActivity, communicate, selected]);

  const endMeeting = useCallback(() => {
    setMeetingActive(false);
    setLiveActivity((current) => ({ ...current, social: "working", manager: "idle", projects: "idle" }));
    setNotice("Reunião encerrada e atividade registrada");
    addActivity({ text: "A reunião de pauta foi encerrada.", tone: "#5bcfbe", origin: "Deskverse", impact: "Próximo passo definido", agentId: "projects", relatedLabel: "Planejamento semanal" });
  }, [addActivity]);

  const sendMessage = useCallback((message: { kind: ConversationKind; targetId?: string; text: string }) => {
    const id = `message-${Date.now()}`;
    const relatedAgent = message.targetId ?? (message.kind === "meeting" ? "projects" : "social");
    const relatedLabel = message.kind === "meeting" ? "Planejamento semanal" : message.kind === "private" ? "Conversa privada" : "Conversa do espaço";
    setMessages((current) => [...current, { id, kind: message.kind, authorId: "current-user", targetId: message.targetId, text: message.text, time: "agora", status: "sending", origin: "Você", relatedLabel }]);
    setNotice("Mensagem enviada para a fila local");
    setNotificationPulse(true);
    addActivity({ text: `Você enviou uma mensagem${message.kind === "meeting" ? " para a reunião" : ""}.`, tone: "#46d3c2", origin: "Você", impact: "Mensagem registrada", agentId: relatedAgent, relatedLabel });
    scheduleAnimationReset(() => {
      setMessages((current) => current.map((item) => item.id === id ? { ...item, status: "sent" } : item));
      setNotificationPulse(false);
      setNotice("Mensagem registrada na atividade");
    }, 650);
  }, [addActivity, scheduleAnimationReset]);

  const openActivity = useCallback((activity: Activity) => {
    if (activity.officeRunId) {
      selectOfficeRun(activity.officeRunId);
      setSelected(null);
      setMenuOpen(false);
      setNotificationsOpen(false);
      setConversationOpen(false);
      setOfficeOpen(true);
      setNotice(`${activity.relatedLabel} aberto no acompanhamento do pedido`);
      return;
    }
    setFocused(activity.agentId);
    setSelected(activity.agentId);
    setMenuOpen(false);
    setNotificationsOpen(false);
    setConversationOpen(false);
    setNotice(`${activity.relatedLabel} aberto no contexto de ${activity.origin}`);
  }, [selectOfficeRun]);

  const openActivityById = useCallback((activityId: string) => {
    const activity = activityFeed.find((item) => item.id === activityId);
    if (activity) openActivity(activity);
  }, [activityFeed, openActivity]);

  const triggerAnimation = useCallback((kind: CanvasAnimationKind) => {
    const actorId = kind === "comunicacao" ? "social" : kind === "selecionar" ? "projects" : kind === "aguardando" ? "manager" : kind === "concluido" ? "content" : kind === "erro" ? "support" : "social";
    const event = { id: Date.now(), kind, actorId, targetId: kind === "comunicacao" ? "manager" : undefined } satisfies CanvasAnimationEvent;
    setAnimationEvent(event);
    setNotice(canvasAnimationLabels[kind]);
    if (kind === "limpar") {
      setAnimationOrder(null);
      setCommunication(null);
      setLiveActivity({});
      setSelected(null);
      setNotificationPulse(false);
      return;
    }
    if (kind === "selecionar") {
      setSelected(actorId);
      setFocused(actorId);
      return;
    }
    if (kind === "reflow") {
      setAnimationOrder(moveAgent(visibleOrder, "social", "projects"));
      scheduleAnimationReset(() => setAnimationOrder(null), 1200);
      return;
    }
    if (kind === "comunicacao") {
      communicate("social", "manager");
      return;
    }
    if (kind === "trabalhando") setLiveActivity((current) => ({ ...current, [actorId]: "working" }));
    if (kind === "aguardando") setLiveActivity((current) => ({ ...current, [actorId]: "waiting" }));
    if (kind === "concluido") {
      setLiveActivity((current) => ({ ...current, [actorId]: "idle" }));
      scheduleAnimationReset(() => setAnimationEvent(null), 850);
    }
    if (kind === "erro") {
      setLiveActivity((current) => ({ ...current, [actorId]: "error" }));
      scheduleAnimationReset(() => setLiveActivity((current) => ({ ...current, [actorId]: "idle" })), 2400);
    }
    if (kind === "notificacao") {
      setNotificationPulse(true);
      scheduleAnimationReset(() => setNotificationPulse(false), 900);
    }
  }, [communicate, scheduleAnimationReset, visibleOrder]);
  const createLeader = (leader: { name: string; role: string; icon: Agent["icon"]; capabilities: Agent["capabilities"] }) => {
    const id = `leader-${Date.now()}`;
    setCustomLeaders((current) => [...current, { id, name: leader.name, role: leader.role, taskSummary: "Pronto para começar", icon: leader.icon, color: "#4ED7C8", activity: "idle", detail: `${leader.name} está pronto para receber objetivos.`, kind: "leader", seniority: "Pleno", capabilities: leader.capabilities, nextAction: "Definir o primeiro objetivo", source: "Dados locais", updatedAt: "agora" }]);
    setOrder((current) => {
      const next = [...current, id];
      orderRef.current = next;
      return next;
    });
    setNotice(`${leader.name} foi adicionado ao canvas`);
    setCreatorOpen(false);
  };

  const onCanvasKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const index = entries.findIndex(({ agent }) => agent.id === focused);
    if (event.key === "Escape") {
      setSelected(null);
      setNotice("Seleção limpa");
      return;
    }
    if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(event.key)) return;
    event.preventDefault();
    const next = entries[index + (event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1)];
    if (next) {
      setFocused(next.agent.id);
      setSelected(next.agent.id);
    }
  };

  const recoverWorkspace = useCallback(() => {
    setCanvasState("success");
    setNotice("Tentando carregar o workspace novamente");
    if (authenticatedUserId && (!activeWorkspaceId || workspaceBootstrapError)) void loadUserWorkspace();
    else void refreshWorkspace();
  }, [activeWorkspaceId, authenticatedUserId, loadUserWorkspace, refreshWorkspace, workspaceBootstrapError]);
  const effectiveCanvasState: CanvasState = (!demoMode && session.isPending && !initialWorkspace) || workspace.loading || (!demoMode && Boolean(authenticatedUserId) && !activeWorkspaceId && !workspaceBootstrapError) ? "loading" : workspace.error || workspaceBootstrapError ? "error" : canvasState;
  const effectiveCanvasError = workspaceBootstrapError ?? workspace.error;

  return <main className={"app-shell " + theme} data-drawer-background>
    <section className="content" id="canvas">
      <CanvasNavbar workspaceName={workspace.snapshot?.context.name ?? "Estúdio Aurora"} query={query} onQueryChange={setQuery} agents={allAgents} onSelectAgent={(id) => { setSelected(id); setFocused(id); }} onOpenMenu={() => { setNotificationsOpen(false); setMenuOpen(true); }} onOpenNotifications={() => { setMenuOpen(false); setNotificationsOpen(true); }} onOpenConversations={() => { setConversationMode("global"); setConversationState("success"); setConversationOpen(true); }} onOpenOfficeControls={() => setOfficeOpen(true)} onAddLeader={() => setCreatorOpen(true)} onOpenAnimationTests={() => setAnimationDrawerOpen(true)} notificationActive={notificationPulse} />
      <CanvasDndProvider><WorkspaceCanvas canvasState={effectiveCanvasState} errorMessage={effectiveCanvasError} entries={entries} selected={selected} focused={focused} zoom={zoom} communication={communication} isReordering={isReordering} animationEvent={animationEvent} reduced={reduced} onSelect={(id) => { setSelected(id); setFocused(id); }} onDragStart={beginAgentDrag} onPreviewReorder={reorderAgents} onOrderCommit={commitAgentOrder} onOrderCancel={cancelAgentOrder} onCanvasKeyDown={onCanvasKeyDown} onRecover={recoverWorkspace} /></CanvasDndProvider>
    </section>
    <AnimatePresence>{selectedAgent && <AgentContextPanel agent={selectedAgent} activity={currentActivity(selectedAgent.id)} reduced={reduced} onClose={() => setSelected(null)} onOpenPrivateChat={() => openPrivateChat(selectedAgent.id)} onStartMeeting={() => startMeeting(selectedAgent.id)} />}</AnimatePresence>
    <CreateLeaderDialog open={creatorOpen} onClose={() => setCreatorOpen(false)} onCreate={createLeader} />
    <CanvasAnimationDrawer open={animationDrawerOpen} setOpen={setAnimationDrawerOpen} onSelect={triggerAnimation} />
    <ConversationDrawer open={conversationOpen} setOpen={setConversationOpen} agents={allAgents} mode={conversationMode} setMode={setConversationMode} targetId={conversationTargetId} setTargetId={setConversationTargetId} messages={messages} state={conversationState} setState={setConversationState} meetingActive={meetingActive} onStartMeeting={() => startMeeting()} onEndMeeting={endMeeting} onSend={sendMessage} onOpenActivity={openActivityById} />
    <CanvasMenuSheet open={menuOpen} setOpen={setMenuOpen} view={view} setView={setView} canvasState={canvasState} setCanvasState={setCanvasState} theme={theme} setTheme={setTheme} workspaceName={workspace.snapshot?.context.name ?? "Estúdio Aurora"} onOpenPlatform={() => setPlatformOpen(true)} />
    <CanvasNotificationsDrawer open={notificationsOpen} setOpen={setNotificationsOpen} activities={activityFeed} notice={notice} onOpenActivity={openActivity} />
    <PlatformDrawer open={platformOpen} setOpen={setPlatformOpen} activeWorkspaceId={workspaceScopeId} onWorkspaceChange={changeWorkspace} role={activeRole} workspaceName={workspace.snapshot?.context.name ?? "Estúdio Aurora"} />
    <OfficeControlDrawer open={officeOpen} setOpen={setOfficeOpen} snapshot={office.snapshot} runs={office.runs} activeRunId={office.activeRunId} loading={office.loading} error={office.error} onDispatch={office.dispatch} onSelectRun={office.selectRun} onCreateRun={office.createRun} onRunScenario={office.runScenario} onRetry={office.retry} />
  </main>;
}
