import { AlertTriangle, Check, CheckCircle2, CircleDot, Clock3, ListChecks, Play, Plus, RefreshCw, Send, ShieldCheck, UserRound, X, XCircle } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { NewOfficeRunDrawer } from "@/components/office/new-office-run-drawer";
import type { CreateOfficeRunInput, OfficeAction, OfficeSnapshot } from "@/types/office";
import { officeScenarios } from "@/features/office/office-simulator";
import { officeApprovalStateLabel, officeCheckpointLabel, officePhaseLabels, officeStateLabel } from "@/features/office/office-domain";
import type { Agent } from "@/components/canvas/agent-data";

type OfficeControlDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  snapshot: OfficeSnapshot | null;
  focusedApprovalId?: string | null;
  runs: OfficeSnapshot[];
  activeRunId: string | null;
  loading: boolean;
  error: string | null;
  onDispatch: (action: OfficeAction) => void;
  onSelectRun: (runId: string) => void;
  onCreateRun: (input: CreateOfficeRunInput) => void;
  onRunScenario: (actions: OfficeAction[]) => void;
  onRetry: () => void;
  leaders: Agent[];
};

const phases = ["entrada", "trabalho", "decisao", "entrega"] as const;

function timeAgo(value: string) {
  try { return formatDistanceToNowStrict(new Date(value), { addSuffix: true, locale: ptBR }); } catch { return "agora"; }
}

export function OfficeControlDrawer({ open, setOpen, snapshot, focusedApprovalId = null, runs, activeRunId, loading, error, onDispatch, onSelectRun, onCreateRun, onRunScenario, onRetry, leaders }: OfficeControlDrawerProps) {
  const state = snapshot?.state ?? "loading";
  const [userAnswer, setUserAnswer] = useState("");
  const [newRunOpen, setNewRunOpen] = useState(false);
  const [cancelConfirmationOpen, setCancelConfirmationOpen] = useState(false);

  const createRun = (input: CreateOfficeRunInput) => {
    setUserAnswer("");
    setCancelConfirmationOpen(false);
    onCreateRun(input);
  };

  const cancelRun = () => {
    setCancelConfirmationOpen(false);
    setUserAnswer("");
    onDispatch({ type: "CANCEL" });
  };

  return <Drawer open={open} onOpenChange={setOpen}>
    <DrawerContent scrollable className="office-drawer">
      <DrawerHeader>
        <DrawerDescription><CircleDot size={14} /> Acompanhar um pedido</DrawerDescription>
        <DrawerTitle>Do pedido à entrega</DrawerTitle>
      </DrawerHeader>

      {loading && <div className="platform-state loading">Carregando pedidos…</div>}
      {error && <div className="platform-state error" role="alert"><AlertTriangle size={16} />{error}<button className="text-button" type="button" onClick={onRetry}>Tentar carregar novamente</button></div>}

      {!loading && <section className="office-runs" aria-labelledby="office-runs-title">
        <div className="office-section-heading">
          <div>
            <p className="eyebrow">TESTE LOCAL</p>
            <h2 id="office-runs-title"><ListChecks size={17} /> {runs.length} {runs.length === 1 ? "pedido" : "pedidos"}</h2>
          </div>
          <button className="secondary-button compact-button" type="button" onClick={() => { setUserAnswer(""); setNewRunOpen(true); }}><Plus size={15} /> Novo pedido</button>
        </div>
        <p className="office-simulation-note">Os dados ficam apenas neste dispositivo. Cada demonstração cria um pedido separado.</p>
        <div className="office-run-list" role="list" aria-label="Pedidos do escritório">
          {runs.map((run) => <button className={`office-run-list-item${run.runId === activeRunId ? " active" : ""}`} key={run.runId} type="button" aria-pressed={run.runId === activeRunId} onClick={() => { setUserAnswer(""); onSelectRun(run.runId); }}>
            <span className={`office-run-list-status ${run.state}`}><span className="status-dot" /></span>
            <span className="office-run-list-copy"><strong>{run.title}</strong><small>{officeStateLabel(run.state)} · {timeAgo(run.updatedAt)}</small></span>
            {run.runId === activeRunId && <Check size={16} aria-hidden="true" />}
          </button>)}
        </div>
      </section>}

      {snapshot && <>
        <div className="office-run-heading">
          <div><p className="eyebrow">PEDIDO</p><h2>{snapshot.title}</h2><p>{snapshot.brief}</p></div>
          <span className={`office-state-pill ${state}`}><span className="status-dot" />{officeStateLabel(state)}</span>
        </div>

        <div className="office-stepper" aria-label="Etapas do pedido">
          {phases.map((phase) => <div key={phase} className={snapshot.phase === phase ? "active" : phases.indexOf(phase) < phases.indexOf(snapshot.phase) ? "done" : ""}><span>{phases.indexOf(phase) + 1}</span><small>{officePhaseLabels[phase]}</small></div>)}
        </div>

        <div className="office-next-step"><p className="eyebrow">PRÓXIMO PASSO</p><strong>{snapshot.nextStep}</strong><span>Origem: {snapshot.source} · Responsável: {snapshot.responsible}</span></div>

        {(snapshot.parameters || snapshot.notes) && <section className="office-request-context" aria-label="Parâmetros do pedido">
          {snapshot.parameters && <div><span>Parâmetros</span><p>{snapshot.parameters}</p></div>}
          {snapshot.notes && <div><span>Contexto adicional</span><p>{snapshot.notes}</p></div>}
        </section>}

        {snapshot.approvals.length > 0 && <section className="office-approvals" aria-labelledby="office-approvals-title">
          <div className="platform-section-heading"><div><p className="eyebrow">DECISÕES</p><h2 id="office-approvals-title"><ShieldCheck size={17} /> Aprovações</h2></div><span className="checkpoint-tag">{snapshot.approvals.filter((approval) => approval.state === "pending").length} pendentes</span></div>
          <p className="office-simulation-note">Cada item mostra exatamente o material, a versão e o motivo da decisão. Aprovar um item não aprova os demais.</p>
          <div className="office-approval-list">
            {snapshot.approvals.map((approval) => <article className={`office-approval-card ${approval.state}${approval.id === focusedApprovalId ? " focused" : ""}`} key={approval.id} aria-current={approval.id === focusedApprovalId ? "step" : undefined}>
              <header><div><strong>{approval.title}</strong><small>{officeApprovalStateLabel(approval.state)} · solicitada por {approval.requestedBy}</small></div><span className={`office-approval-status ${approval.state}`}><span className="status-dot" />{officeApprovalStateLabel(approval.state)}</span></header>
              <p>{approval.summary}</p>
              <small className="office-approval-reason">Motivo: {approval.reason}</small>
              {approval.artifacts.length > 0 && <div className="office-approval-artifacts" aria-label={`Materiais da aprovação ${approval.title}`}>{approval.artifacts.map((artifact) => <span key={artifact.id}>{artifact.label} · {artifact.version}</span>)}</div>}
            </article>)}
          </div>
        </section>}

        <section className="office-manual-flow" aria-labelledby="office-manual-flow-title">
          <div className="platform-section-heading">
            <div><p className="eyebrow">CONTROLE MANUAL</p><h2 id="office-manual-flow-title">Uma etapa por vez</h2></div>
          </div>
          <p className="office-manual-intro">Use estas ações para acompanhar cada pausa, decisão e retomada. O próximo passo aparece sempre destacado acima.</p>
          <div className="office-actions" aria-label="Ações do pedido">
            {state === "empty" && <button className="primary-button" type="button" onClick={() => onDispatch({ type: "START" })}><Play size={16} /> Iniciar trabalho</button>}
            {state === "working" && snapshot.checkpoint === "approval-approved" && <button className="primary-button" type="button" onClick={() => onDispatch({ type: "COMPLETE" })}><Send size={16} /> Confirmar entrega</button>}
            {state === "working" && snapshot.checkpoint !== "approval-approved" && <>
              <button className="secondary-button" type="button" onClick={() => { setUserAnswer(""); onDispatch({ type: "REQUEST_USER" }); }}><UserRound size={16} /> Pedir uma informação</button>
              <button className="secondary-button" type="button" onClick={() => onDispatch({ type: "REQUEST_APPROVAL" })}><ShieldCheck size={16} /> Pedir aprovação</button>
              <button className="secondary-button" type="button" onClick={() => onDispatch({ type: "FAIL" })}><AlertTriangle size={16} /> Simular erro</button>
            </>}
            {state === "WAITING_USER" && <div className="office-answer-field">
              <label htmlFor="office-answer">Qual público deve receber prioridade?</label>
              <input id="office-answer" value={userAnswer} onChange={(event) => setUserAnswer(event.target.value)} placeholder="Ex.: leads quentes e clientes atuais" />
              <button className="primary-button" type="button" disabled={!userAnswer.trim()} onClick={() => { onDispatch({ type: "ANSWER_USER", answer: userAnswer }); setUserAnswer(""); }}><UserRound size={16} /> Enviar resposta</button>
            </div>}
            {state === "WAITING_APPROVAL" && <div className="office-approval-action-list">
              {(snapshot.approvals.filter((approval) => approval.state === "pending").length ? snapshot.approvals.filter((approval) => approval.state === "pending") : [{ id: undefined, title: "entrega" }]).map((approval) => <div className="office-approval-action" key={approval.id ?? "legacy-approval"}><strong>Decidir: {approval.title}</strong><div><button className="primary-button" type="button" onClick={() => onDispatch({ type: "APPROVE", approvalId: approval.id })}><ShieldCheck size={16} /> Aprovar item</button><button className="secondary-button" type="button" onClick={() => onDispatch({ type: "REJECT", approvalId: approval.id })}><AlertTriangle size={16} /> Pedir ajustes</button></div></div>)}
            </div>}
            {state === "error" && <button className="primary-button" type="button" onClick={() => onDispatch({ type: "RETRY" })}><RefreshCw size={16} /> Continuar de onde parou</button>}
            {state === "success" && <button className="secondary-button" type="button" onClick={() => { setUserAnswer(""); setNewRunOpen(true); }}><Plus size={16} /> Preparar novo pedido</button>}
            {snapshot && state !== "success" && state !== "cancelled" && !cancelConfirmationOpen && <button className="secondary-button danger-button" type="button" onClick={() => setCancelConfirmationOpen(true)}><XCircle size={16} /> Cancelar pedido</button>}
          </div>
          {cancelConfirmationOpen && <div className="office-cancel-confirmation" role="alert">
            <div><strong>Cancelar este pedido?</strong><p>O trabalho será interrompido e nenhuma nova etapa será iniciada.</p></div>
            <div className="office-cancel-actions"><button className="secondary-button" type="button" onClick={() => setCancelConfirmationOpen(false)}><X size={15} /> Voltar</button><button className="primary-button danger-button" type="button" onClick={cancelRun}><XCircle size={15} /> Sim, cancelar pedido</button></div>
          </div>}
          {state === "cancelled" && <p className="office-cancelled-note" role="status"><XCircle size={16} /> Este pedido foi cancelado. Você pode criar um novo quando quiser.</p>}
        </section>

        <section className="office-scenarios">
          <div className="platform-section-heading"><div><p className="eyebrow">ATALHOS DE TESTE</p><h2>Demonstrações rápidas</h2></div></div>
          <p className="office-simulation-note">Estes atalhos percorrem várias etapas de uma vez. Para testar com calma, use o controle manual acima.</p>
          {Object.entries(officeScenarios).map(([key, scenario]) => <button className="office-scenario" key={key} type="button" onClick={() => { setUserAnswer(""); onRunScenario(scenario.actions); }}><span><strong>{scenario.label}</strong><small>{scenario.description}</small></span><Play size={15} /></button>)}
        </section>

        <section className="office-events">
          <div className="platform-section-heading"><div><p className="eyebrow">HISTÓRICO DO PEDIDO</p><h2>{snapshot.events.length} {snapshot.events.length === 1 ? "evento" : "eventos"}</h2></div><span className="checkpoint-tag"><Clock3 size={13} /> ponto salvo: {officeCheckpointLabel(snapshot.checkpoint)}</span></div>
          {snapshot.events.length ? snapshot.events.map((event) => <article className="office-event" key={event.id}><div className="office-event-icon"><CheckCircle2 size={15} /></div><div><header><strong>{event.message}</strong><time>{timeAgo(event.occurredAt)}</time></header><p>{event.impact}</p><small><b>{event.source}</b> · {event.responsible} · Próximo: {event.nextStep}</small></div></article>) : <div className="platform-state empty">Ainda não há eventos. O pedido começa quando você iniciar o trabalho.</div>}
        </section>

        <footer className="office-delivery"><div><p className="eyebrow">ENTREGA</p><strong>{snapshot.delivery.label}</strong></div><span className={snapshot.delivery.status === "ready" ? "service-ready" : "service-pending"}>{snapshot.delivery.status === "ready" ? <><CheckCircle2 size={15} /> Pronta</> : "Protegida até a aprovação"}</span></footer>
      </>}
    </DrawerContent>
    <NewOfficeRunDrawer open={newRunOpen} setOpen={setNewRunOpen} onCreate={createRun} leaders={leaders} />
  </Drawer>;
}
