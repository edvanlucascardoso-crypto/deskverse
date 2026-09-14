import { motion } from "motion/react";
import { MessageCircle, Users } from "lucide-react";
import type { CSSProperties } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { activityLabel, isActiveActivity, statusColor, type Agent, type AgentActivity } from "./agent-data";

type AgentContextPanelProps = { agent: Agent; activity: AgentActivity; reduced: boolean | null; onClose: () => void; onOpenPrivateChat: () => void; onStartMeeting: () => void };

export function AgentContextPanel({ agent, activity, reduced, onClose, onOpenPrivateChat, onStartMeeting }: AgentContextPanelProps) {
  const Icon = agent.icon;
  const isActive = isActiveActivity(activity);
  const className = "context-logo" + (isActive ? " is-active" : "");
  const statusClassName = "status-pill" + (isActive ? " active" : "");
  const isLeader = agent.kind === "leader";
  return <Drawer open modal={false} onOpenChange={(open) => { if (!open) onClose(); }}><DrawerContent scrollable className="context-panel"><span className={className} style={{ "--agent-color": agent.color } as CSSProperties}><Icon size={54} strokeWidth={.65} /></span><p className="eyebrow">{isLeader ? "LÍDER" : "ESPECIALISTA"} · {agent.seniority}</p><h2>{agent.name}</h2><motion.span key={activity} className={statusClassName} initial={reduced ? false : { scale: .72, opacity: .35 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: reduced ? 0 : .24, ease: [0.22, 1, 0.36, 1] }} style={{ "--agent-color": agent.color, "--status-color": statusColor(activity) } as CSSProperties} title={activityLabel(activity)} aria-label={activityLabel(activity)}><i /></motion.span><div className="context-block"><h3>Agora</h3><p>{agent.detail}</p></div><div className="context-block"><h3>Próximo passo</h3><p>{agent.nextAction ?? "Sem próximo passo definido."}</p><small>{agent.source ?? "Dados locais"} · {agent.updatedAt ?? "agora"}</small></div>{isLeader ? <div className="context-block"><h3>Especialidades</h3><div className="capability-list">{agent.capabilities?.map((item) => <span key={item.capability}>{item.capability}<small>{item.seniority}</small></span>)}</div><p>As delegações são resolvidas por especialidade, sem cópias privadas.</p></div> : <div className="context-block"><h3>Fila da especialidade</h3><p>{agent.queueSummary}</p><p>Este especialista pode atender mais de um líder.</p></div>}<div className="context-block context-actions"><button className="primary-button full-width" onClick={onOpenPrivateChat}><MessageCircle size={16} /> Conversar em privado</button><button className="secondary-button full-width" onClick={onStartMeeting}><Users size={16} /> Iniciar reunião</button></div></DrawerContent></Drawer>;
}
