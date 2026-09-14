"use client";

import { Check, CircleAlert, Clock3, LoaderCircle, MessageCircle, Send, UserRound, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Agent, CanvasState, ConversationKind, ConversationMessage } from "./agent-data";

type ConversationDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  agents: Agent[];
  mode: ConversationKind;
  setMode: (mode: ConversationKind) => void;
  targetId: string | null;
  setTargetId: (id: string) => void;
  messages: ConversationMessage[];
  state: CanvasState;
  setState: (state: CanvasState) => void;
  meetingActive: boolean;
  onStartMeeting: () => void;
  onEndMeeting: () => void;
  onSend: (message: { kind: ConversationKind; targetId?: string; text: string }) => void;
  onOpenActivity: (activityId: string) => void;
};

const meetingParticipants = ["social", "manager", "projects"];

function authorName(authorId: string, agents: Agent[]) {
  return authorId === "current-user" ? "Você" : agents.find((agent) => agent.id === authorId)?.name ?? "Agente";
}

function messageStatus(status: ConversationMessage["status"]) {
  if (status === "sending") return "Enviando";
  if (status === "failed") return "Falhou";
  return "Enviada";
}

export function ConversationDrawer({ open, setOpen, agents, mode, setMode, targetId, setTargetId, messages, state, setState, meetingActive, onStartMeeting, onEndMeeting, onSend, onOpenActivity }: ConversationDrawerProps) {
  const [draft, setDraft] = useState("");
  const [peopleDrawerOpen, setPeopleDrawerOpen] = useState(false);
  const [meetingPeopleDrawerOpen, setMeetingPeopleDrawerOpen] = useState(false);
  const [stateDrawerOpen, setStateDrawerOpen] = useState(false);
  const target = agents.find((agent) => agent.id === targetId) ?? agents[0] ?? null;
  const visibleMessages = useMemo(() => messages.filter((message) => {
    if (mode === "global") return message.kind === "global";
    if (mode === "meeting") return message.kind === "meeting";
    if (!target) return false;
    return message.kind === "private" && ((message.authorId === target.id && message.targetId === "current-user") || (message.authorId === "current-user" && message.targetId === target.id));
  }), [messages, mode, target]);
  const title = mode === "global" ? "Conversa do espaço" : mode === "meeting" ? "Reunião de pauta" : target ? `Conversa com ${target.name}` : "Conversa privada";
  const send = () => {
    const text = draft.trim();
    if (!text || (mode === "private" && !target)) return;
    onSend({ kind: mode, targetId: mode === "private" ? target?.id : undefined, text });
    setDraft("");
  };

  return <Drawer open={open} onOpenChange={setOpen}><DrawerContent scrollable className="conversation-drawer"><DrawerHeader><DrawerDescription><MessageCircle size={14} /> Conversas</DrawerDescription><div className="conversation-title-row"><DrawerTitle>{title}</DrawerTitle>{mode === "global" && <button className="conversation-people-count" type="button" onClick={() => setPeopleDrawerOpen(true)} aria-label={`Abrir ${agents.length} pessoas do espaço`}><UserRound size={16} /><span>{agents.length}</span></button>}</div></DrawerHeader><Tabs value={mode} onValueChange={(value) => setMode(value as ConversationKind)} className="conversation-tabs"><TabsList><TabsTrigger value="global">Espaço</TabsTrigger><TabsTrigger value="private">Privada</TabsTrigger><TabsTrigger value="meeting">Reunião</TabsTrigger></TabsList></Tabs>
    {mode === "private" && <button className="conversation-secondary-action" type="button" onClick={() => setPeopleDrawerOpen(true)}><MessageCircle size={16} /> Trocar conversa <small>{target?.name ?? "Selecionar"}</small></button>}
    {mode === "meeting" && <section className="meeting-summary"><div><span className={meetingActive ? "meeting-live" : "meeting-idle"}><Users size={15} /> {meetingActive ? "Em andamento" : "Pronta para iniciar"}</span><p>{meetingActive ? "Uma conversa por vez mantém o canvas legível." : "Reúna agentes sem sair do contexto do trabalho."}</p></div><button type="button" className={meetingActive ? "secondary-button" : "primary-button"} onClick={meetingActive ? onEndMeeting : onStartMeeting}>{meetingActive ? "Encerrar reunião" : "Iniciar reunião"}</button><button type="button" className="conversation-secondary-action" onClick={() => setMeetingPeopleDrawerOpen(true)}><Users size={16} /> Participantes <small>{meetingParticipants.length}</small></button></section>}
    <button className="conversation-secondary-action" type="button" onClick={() => setStateDrawerOpen(true)}><CircleAlert size={16} /> Estado da conversa <small>{state === "success" ? "Ativo" : state === "loading" ? "Carregando" : state === "empty" ? "Vazio" : "Falha"}</small></button>
    <section className="conversation-history" aria-label="Histórico da conversa"><header><span>Histórico</span>{state === "success" && <small>{visibleMessages.length} mensagens</small>}</header>{state === "loading" && <div className="conversation-feedback"><LoaderCircle className="spin" size={26} /><strong>Carregando mensagens</strong><span>Atualizando a conversa.</span></div>}{state === "empty" && <div className="conversation-feedback"><MessageCircle size={26} /><strong>Nenhuma mensagem aqui ainda</strong><span>Envie a primeira mensagem para iniciar esta conversa.</span><button className="secondary-button" type="button" onClick={() => setState("success")}>Abrir conversa</button></div>}{state === "error" && <div className="conversation-feedback error"><CircleAlert size={26} /><strong>Não foi possível abrir a conversa</strong><span>Os últimos dados conhecidos continuam preservados.</span><button className="secondary-button" type="button" onClick={() => setState("success")}>Tentar novamente</button></div>}{state === "success" && <><div className="conversation-messages" aria-live="polite">{visibleMessages.map((message) => <article key={message.id} className={"conversation-message" + (message.authorId === "current-user" ? " own" : "")}><header><strong>{authorName(message.authorId, agents)}</strong><span>{message.time}</span></header><p>{message.text}</p><footer><span>{message.origin}</span><span className={message.status === "failed" ? "failed" : ""}>{message.status === "sent" ? <Check size={12} /> : <Clock3 size={12} />}{messageStatus(message.status)}</span>{message.activityId && <button type="button" onClick={() => onOpenActivity(message.activityId!)}>{message.relatedLabel ?? "Ver atividade"}</button>}</footer></article>)}</div><form className="conversation-composer" onSubmit={(event) => { event.preventDefault(); send(); }}><label className="sr-only" htmlFor="conversation-message">Mensagem</label><input id="conversation-message" disabled={mode === "meeting" && !meetingActive} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={mode === "meeting" ? meetingActive ? "Enviar para a reunião" : "Inicie a reunião para enviar" : "Escrever uma mensagem"} /><button type="submit" className="primary-button" disabled={!draft.trim() || (mode === "meeting" && !meetingActive)} aria-label="Enviar mensagem"><Send size={16} /></button></form></>}</section>
    <Drawer open={peopleDrawerOpen} onOpenChange={setPeopleDrawerOpen}><DrawerContent scrollable className="conversation-subdrawer"><DrawerHeader><DrawerDescription><Users size={14} /> {mode === "global" ? "Conversa do espaço" : "Conversa privada"}</DrawerDescription><DrawerTitle>{mode === "global" ? "Pessoas do espaço" : "Escolher agente"}</DrawerTitle></DrawerHeader><div className="conversation-people-list">{agents.map((agent) => <button key={agent.id} type="button" className={mode === "private" && agent.id === target?.id ? "selected" : ""} onClick={() => { setTargetId(agent.id); setMode("private"); setPeopleDrawerOpen(false); }}><span style={{ background: agent.color }}>{agent.name.slice(0, 1)}</span><p>{agent.name}<small>{agent.role}</small></p></button>)}</div></DrawerContent></Drawer>
    <Drawer open={meetingPeopleDrawerOpen} onOpenChange={setMeetingPeopleDrawerOpen}><DrawerContent scrollable className="conversation-subdrawer"><DrawerHeader><DrawerDescription><Users size={14} /> Reunião de pauta</DrawerDescription><DrawerTitle>Participantes</DrawerTitle></DrawerHeader><div className="conversation-people-list">{meetingParticipants.map((id) => { const agent = agents.find((item) => item.id === id); return agent ? <div key={agent.id} className="conversation-person-static"><i style={{ background: agent.color }} /> <span>{agent.name}<small>{agent.role}</small></span></div> : null; })}</div></DrawerContent></Drawer>
    <Drawer open={stateDrawerOpen} onOpenChange={setStateDrawerOpen}><DrawerContent scrollable className="conversation-subdrawer"><DrawerHeader><DrawerDescription><CircleAlert size={14} /> Controles</DrawerDescription><DrawerTitle>Estado da conversa</DrawerTitle></DrawerHeader><div className="conversation-state-controls">{(["success", "loading", "empty", "error"] as CanvasState[]).map((item) => <button key={item} type="button" className={state === item ? "active" : ""} onClick={() => { setState(item); setStateDrawerOpen(false); }}>{item === "success" ? "Ativo" : item === "loading" ? "Carregando" : item === "empty" ? "Vazio" : "Falha"}</button>)}</div></DrawerContent></Drawer>
  </DrawerContent></Drawer>;
}
