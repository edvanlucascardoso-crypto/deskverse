"use client";

import { AlertTriangle, Ban, CheckCircle2, CircleDot, Clock3, Inbox, ListTodo, PauseCircle, Play, Plus, RefreshCw, RotateCcw, ShieldCheck, XCircle } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import type { QueueJob, QueueJobState } from "@/lib/platform/contracts";
import { queueJobTypeLabel, queuePriorityLabels, queueStateLabels, queueStateTone, resourceClassLabels } from "@/features/queue/queue-domain";
import { useQueueStore } from "@/features/queue/use-queue-store";

type QueueFilter = "all" | "ready" | "working" | "waiting" | "attention";

type QueueDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  workspaceId: string;
  demoMode?: boolean;
};

const filterLabels: Record<QueueFilter, string> = {
  all: "Todas",
  ready: "Prontas",
  working: "Em andamento",
  waiting: "Aguardando",
  attention: "Atenção",
};

function timeAgo(timestamp: number) {
  try {
    return formatDistanceToNowStrict(new Date(timestamp), { addSuffix: true, locale: ptBR });
  } catch {
    return "agora";
  }
}

function matchesFilter(job: QueueJob, filter: QueueFilter) {
  if (filter === "all") return true;
  if (filter === "ready") return job.state === "READY" || job.state === "PENDING" || job.state === "RETRY_SCHEDULED";
  if (filter === "working") return job.state === "RUNNING";
  if (filter === "waiting") return job.state === "WAITING_USER" || job.state === "WAITING_APPROVAL";
  return job.state === "FAILED" || job.state === "CANCELLED" || job.state === "DEAD_LETTER";
}

function StateIcon({ state }: { state: QueueJobState }) {
  if (state === "SUCCEEDED") return <CheckCircle2 size={15} />;
  if (state === "FAILED" || state === "CANCELLED" || state === "DEAD_LETTER") return <AlertTriangle size={15} />;
  if (state === "WAITING_USER" || state === "WAITING_APPROVAL" || state === "PENDING" || state === "RETRY_SCHEDULED") return <Clock3 size={15} />;
  if (state === "RUNNING") return <Play size={15} />;
  return <CircleDot size={15} />;
}

function SelectedJobDetail({ job, onComplete, onWait, onResume, onTechnicalFailure, onSemanticFailure, onCancel, onReprocess }: {
  job: QueueJob;
  onComplete: () => void;
  onWait: (state: "WAITING_USER" | "WAITING_APPROVAL") => void;
  onResume: () => void;
  onTechnicalFailure: () => void;
  onSemanticFailure: () => void;
  onCancel: () => void;
  onReprocess: () => void;
}) {
  const documentId = typeof job.payload.documentId === "string" ? job.payload.documentId : null;
  const checksum = typeof job.payload.checksum === "string" ? job.payload.checksum : null;
  const canCancel = !["SUCCEEDED", "FAILED", "CANCELLED", "DEAD_LETTER"].includes(job.state);

  return <section className="queue-job-detail" aria-labelledby="queue-selected-job-title">
    <header>
      <div><p className="eyebrow">TAREFA SELECIONADA</p><h2 id="queue-selected-job-title">{queueJobTypeLabel(job.jobType)}</h2></div>
      <span className={`queue-state-pill ${queueStateTone(job.state)}`}><StateIcon state={job.state} />{queueStateLabels[job.state]}</span>
    </header>
    <dl className="queue-job-meta">
      <div><dt>Origem</dt><dd>{job.origin ?? "Não informada"}</dd></div>
      <div><dt>Responsável</dt><dd>{job.responsible ?? "Fila de trabalho"}</dd></div>
      <div><dt>Última atualização</dt><dd>{timeAgo(job.updatedAt ?? job.createdAt)}</dd></div>
      <div><dt>Próximo passo</dt><dd>{job.nextStep ?? "Acompanhar a próxima mudança"}</dd></div>
      <div><dt>Tentativas</dt><dd>{job.attempt} de {job.maxAttempts}</dd></div>
      <div><dt>Classe</dt><dd>{resourceClassLabels[job.resourceClass]}</dd></div>
    </dl>
    {(documentId || checksum) && <div className="queue-document-reference"><p className="eyebrow">REFERÊNCIA DO DOCUMENTO</p>{documentId && <span>Documento: {documentId}</span>}{checksum && <span>Checksum: {checksum}</span>}</div>}
    {job.lastError && <div className="queue-last-error" role="alert"><AlertTriangle size={15} /><span>{job.lastError.message}</span></div>}
    <div className="queue-actions" aria-label="Ações da tarefa">
      {job.state === "RUNNING" && <>
        <button className="primary-button" type="button" onClick={onComplete}><CheckCircle2 size={16} /> Concluir tarefa</button>
        <button className="secondary-button" type="button" onClick={() => onWait("WAITING_USER")}><PauseCircle size={16} /> Aguardar sua resposta</button>
        <button className="secondary-button" type="button" onClick={() => onWait("WAITING_APPROVAL")}><ShieldCheck size={16} /> Pedir aprovação</button>
        <button className="secondary-button" type="button" onClick={onTechnicalFailure}><RefreshCw size={16} /> Simular erro recuperável</button>
        <button className="secondary-button" type="button" onClick={onSemanticFailure}><AlertTriangle size={16} /> Enviar para revisão</button>
      </>}
      {(job.state === "WAITING_USER" || job.state === "WAITING_APPROVAL") && <button className="primary-button" type="button" onClick={onResume}><Play size={16} /> Continuar de onde parou</button>}
      {job.state === "DEAD_LETTER" && <button className="primary-button" type="button" onClick={onReprocess}><RotateCcw size={16} /> Reprocessar explicitamente</button>}
      {canCancel && <button className="secondary-button danger-button" type="button" onClick={onCancel}><Ban size={16} /> Cancelar esta tarefa e dependências</button>}
    </div>
  </section>;
}

export function QueueDrawer({ open, setOpen, workspaceId, demoMode = false }: QueueDrawerProps) {
  const store = useQueueStore(workspaceId, demoMode);
  const [filter, setFilter] = useState<QueueFilter>("all");
  const visibleJobs = store.jobs.filter((job) => matchesFilter(job, filter));

  return <Drawer open={open} onOpenChange={setOpen}>
    <DrawerContent scrollable className="queue-drawer">
      <DrawerHeader>
        <DrawerDescription><ListTodo size={14} /> Observação da fila</DrawerDescription>
        <DrawerTitle>Fila de trabalho</DrawerTitle>
      </DrawerHeader>
      <div className="drawer-workspace-context"><p className="eyebrow">TAREFAS DO ESPAÇO</p><h2>Acompanhe sem perder o contexto</h2><p>Prioridade, espera, tentativa e próximo passo ficam visíveis antes de uma tarefa avançar.</p></div>

      {store.loading && <div className="platform-state loading"><RefreshCw className="spin" size={16} /> Carregando tarefas…</div>}
      {store.error && <div className="platform-state error" role="alert"><AlertTriangle size={16} /><span>{store.error}</span><button className="text-button" type="button" onClick={() => void store.refresh()}>Tentar carregar novamente</button></div>}

      {!store.loading && <>
        <section className="queue-overview" aria-labelledby="queue-overview-title">
          <div className="platform-section-heading"><div><p className="eyebrow">ESTADO AGORA</p><h2 id="queue-overview-title"><Inbox size={17} /> {store.jobs.length} {store.jobs.length === 1 ? "tarefa" : "tarefas"}</h2></div><button className="icon-button" type="button" aria-label="Atualizar fila" title="Atualizar fila" onClick={() => void store.refresh()}><RefreshCw size={16} /></button></div>
          <p className="queue-overview-note">O trabalho interativo tem preferência; tarefas baixas envelhecem para não ficar esquecidas.</p>
          <div className="queue-primary-actions"><button className="primary-button" type="button" onClick={() => void store.claimNext()}><Play size={16} /> Assumir próxima tarefa</button><button className="secondary-button" type="button" onClick={() => void store.enqueueDocumentJob()}><Plus size={16} /> Adicionar tarefa</button></div>
          <p className="queue-live-notice" aria-live="polite"><CircleDot size={13} /> {store.notice}</p>
        </section>

        <div className="queue-filters" role="tablist" aria-label="Filtrar tarefas">{(Object.keys(filterLabels) as QueueFilter[]).map((item) => <button key={item} type="button" role="tab" aria-selected={filter === item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{filterLabels[item]}</button>)}</div>

        {visibleJobs.length ? <div className="queue-job-list" role="list" aria-label="Tarefas da fila">{visibleJobs.map((job) => <div key={job.id} role="listitem"><button type="button" className={`queue-job-item${job.id === store.selectedJobId ? " selected" : ""}`} aria-pressed={job.id === store.selectedJobId} onClick={() => store.setSelectedJobId(job.id)}><span className={`queue-job-status ${queueStateTone(job.state)}`}><StateIcon state={job.state} /></span><span className="queue-job-copy"><strong>{queueJobTypeLabel(job.jobType)}</strong><small>{queueStateLabels[job.state]} · prioridade {queuePriorityLabels[job.priority]}</small></span><span className="queue-job-resource">{resourceClassLabels[job.resourceClass]}</span></button></div>)}</div> : <div className="platform-state empty"><Inbox size={22} /><strong>{store.jobs.length ? "Nenhuma tarefa neste filtro" : "A fila está vazia"}</strong><span>{store.jobs.length ? "Escolha outro estado para continuar acompanhando." : "Adicione uma tarefa para acompanhar o caminho completo."}</span><button className="secondary-button" type="button" onClick={() => void store.enqueueDocumentJob()}><Plus size={16} /> Adicionar tarefa</button></div>}

        {store.selectedJob && <SelectedJobDetail job={store.selectedJob} onComplete={() => void store.completeSelected()} onWait={(state) => void store.waitSelected(state)} onResume={() => void store.resumeSelected()} onTechnicalFailure={() => void store.failSelected(true)} onSemanticFailure={() => void store.failSelected(false)} onCancel={() => void store.cancelSelected(true)} onReprocess={() => void store.reprocessSelected()} />}

        <details className="queue-fixture-tools"><summary>Teste local da fila</summary><p>O adaptador local permite demonstrar uma indisponibilidade sem apagar as tarefas já carregadas.</p><button className="secondary-button" type="button" onClick={store.simulateReadError}><XCircle size={15} /> Simular erro de leitura</button></details>
      </>}
    </DrawerContent>
  </Drawer>;
}
