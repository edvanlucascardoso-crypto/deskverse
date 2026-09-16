"use client";

import { AlertTriangle, BookOpenText, CheckCircle2, FileAudio, FileSpreadsheet, FileText, Headphones, LoaderCircle, RefreshCw, Search, ShieldCheck, Sparkles, Trash2, Upload, XCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import type { KnowledgeConflict, KnowledgeDocument, KnowledgeFact } from "@/types/knowledge";
import { buildBrandProfile, brandReadinessLabel } from "@/features/knowledge/brand-domain";
import { decideKnowledgeConflict } from "@/features/knowledge/conflicts-domain";
import { createKnowledgeFixtures, type KnowledgeFixtureState } from "@/features/knowledge/knowledge-fixtures";
import { answerOnboardingQuestion, onboardingProgress } from "@/features/knowledge/onboarding-domain";
import { detectKnowledgeFormat, documentStatusLabels, formatLabels, onboardingQuestions } from "@/features/knowledge/knowledge-domain";
import { DocumentRagReplaceButton, RagControls } from "@/components/knowledge/rag-controls";

type KnowledgeTab = "files" | "onboarding" | "search" | "review" | "brand";
type KnowledgeStateSetter = Dispatch<SetStateAction<KnowledgeFixtureState>>;

const tabLabels: Record<KnowledgeTab, string> = { files: "Arquivos", onboarding: "Onboarding", search: "Buscar", review: "Revisar", brand: "Perfil" };

function emptyKnowledgeState(workspaceId: string): KnowledgeFixtureState {
  const fixture = createKnowledgeFixtures(workspaceId);
  return { ...fixture, documents: [], chunks: [], facts: [], conflicts: [], brand: buildBrandProfile({ workspaceId, onboarding: fixture.onboarding, facts: [] }), rag: { ...fixture.rag, generation: 0, status: "EMPTY", lastAction: undefined } };
}

function stateFromSnapshot(workspaceId: string, value: unknown): KnowledgeFixtureState {
  if (!value || typeof value !== "object") throw new Error("A base de conhecimento não retornou um snapshot válido.");
  const snapshot = value as Partial<KnowledgeFixtureState>;
  const fallback = emptyKnowledgeState(workspaceId);
  return {
    ...fallback,
    documents: Array.isArray(snapshot.documents) ? snapshot.documents as KnowledgeDocument[] : [],
    onboarding: snapshot.onboarding ?? fallback.onboarding,
    facts: Array.isArray(snapshot.facts) ? snapshot.facts as KnowledgeFact[] : [],
    conflicts: Array.isArray(snapshot.conflicts) ? snapshot.conflicts as KnowledgeConflict[] : [],
    brand: snapshot.brand ? { ...fallback.brand, ...snapshot.brand, rules: Array.isArray(snapshot.brand.rules) ? snapshot.brand.rules.map(String) : [] } : fallback.brand,
    rag: snapshot.rag ?? fallback.rag,
  };
}

function fileIcon(format: KnowledgeDocument["format"]) {
  if (format === "audio") return <FileAudio size={17} />;
  if (format === "xlsx" || format === "xls" || format === "csv") return <FileSpreadsheet size={17} />;
  return <FileText size={17} />;
}

function statusIcon(status: KnowledgeDocument["processingStatus"]) {
  if (status === "READY") return <CheckCircle2 size={15} />;
  if (status === "FAILED") return <XCircle size={15} />;
  if (status === "WAITING_USER") return <AlertTriangle size={15} />;
  return <LoaderCircle className="spin" size={15} />;
}

function updateDocument(state: KnowledgeFixtureState, documentId: string, update: Partial<KnowledgeDocument>): KnowledgeFixtureState {
  return { ...state, documents: state.documents.map((document) => document.id === documentId ? { ...document, ...update } : document) };
}

function FilesPanel({ state, setState, demoMode, workspaceId, onRefresh }: { state: KnowledgeFixtureState; setState: KnowledgeStateSetter; demoMode: boolean; workspaceId: string; onRefresh: () => Promise<void> }) {
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("O original fica no storage; só o conteúdo normalizado segue para a busca.");
  const uploadRemote = async (file: File) => {
    setBusy(true);
    setNotice("Enviando o original e preparando a conversão…");
    try {
      const form = new FormData();
      form.append("file", file);
      if (description.trim()) form.append("description", description.trim());
      const response = await fetch(`/api/workspaces/${workspaceId}/knowledge/documents`, { method: "POST", body: form });
      const payload = await response.json().catch(() => ({})) as { message?: string; status?: string };
      if (!response.ok && response.status !== 202) throw new Error(payload.message || "Não foi possível enviar o arquivo.");
      setDescription("");
      setNotice(payload.status === "WAITING_USER" ? "Áudio armazenado. A interpretação aguarda a chave da OpenAI e a revisão da transcrição." : "Arquivo armazenado e convertido. Só o Markdown confirmado segue para o RAG.");
      await onRefresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Não foi possível enviar o arquivo agora.");
    } finally {
      setBusy(false);
    }
  };
  const onFile = (file?: File) => {
    if (!file) return;
    if (!demoMode) {
      void uploadRemote(file);
      return;
    }
    const format = detectKnowledgeFormat(file.name, file.type);
    const id = `local-${file.name}-${file.size}`;
    const waitingAudio = format === "audio";
    const document: KnowledgeDocument = { id, workspaceId: state.onboarding.workspaceId, name: file.name, mimeType: file.type || "application/octet-stream", format, size: file.size, checksum: "sha256:calculado-no-worker", origin: "Upload local", description: description.trim() || undefined, processingStatus: waitingAudio ? "WAITING_USER" : "NORMALIZING", processingError: waitingAudio ? "Configure OPENAI_API_KEY para usar o Whisper e revisar a transcrição." : undefined, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setState((current) => ({ ...current, documents: [document, ...current.documents] }));
    setDescription("");
    if (waitingAudio) setNotice("Áudio armazenado. A interpretação aguarda a chave da OpenAI e não aparece no RAG antes da revisão.");
    else {
      setNotice(`${formatLabels[format]} confirmado. O arquivo só será indexado depois da normalização.`);
      window.setTimeout(() => setState((current) => updateDocument(current, id, { processingStatus: "READY", processingError: undefined, updatedAt: new Date().toISOString() })), 450);
    }
  };
  const removeDocument = (document: KnowledgeDocument) => {
    if (demoMode) {
      setState((current) => ({ ...current, documents: current.documents.filter((item) => item.id !== document.id), chunks: current.chunks.filter((chunk) => chunk.documentId !== document.id) }));
      setNotice("Arquivo removido desta demonstração local.");
      return;
    }
    void (async () => {
      setBusy(true);
      try {
        const response = await fetch(`/api/workspaces/${workspaceId}/knowledge/documents?documentId=${encodeURIComponent(document.id)}`, { method: "DELETE" });
        const payload = await response.json().catch(() => ({})) as { message?: string };
        if (!response.ok) throw new Error(payload.message || "Não foi possível remover o arquivo.");
        setNotice("Arquivo removido do storage e da base de conhecimento.");
        await onRefresh();
      } catch (error) {
        setNotice(error instanceof Error ? error.message : "Não foi possível remover o arquivo agora.");
      } finally {
        setBusy(false);
      }
    })();
  };
  return <div className="knowledge-panel-stack">
    <div className="knowledge-callout"><Upload size={17} /><span><strong>Converter antes de buscar</strong><small>PDF e Word viram Markdown; Excel vira CSV + tabela Markdown; áudio só segue após Whisper e revisão.</small></span></div>
    <RagControls state={state} setState={setState} demoMode={demoMode} workspaceId={workspaceId} onRefresh={onRefresh} />
    <label className="knowledge-upload"><Upload size={18} /><span>{busy ? "Processando arquivo…" : "Escolher arquivo"}</span><small>PDF, DOCX, XLSX, CSV, texto ou áudio</small><input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.md,.markdown,.html,.json,.mp3,.wav,.m4a,.ogg,.flac,audio/*" disabled={busy} onChange={(event) => onFile(event.target.files?.[0])} /></label>
    <label className="knowledge-field"><span>Descrição de uso (opcional)</span><textarea value={description} disabled={busy} onChange={(event) => setDescription(event.target.value)} placeholder="Como e quando os agentes devem usar este arquivo?" rows={2} /></label>
    <p className="knowledge-notice" role="status">{notice}</p>
    <div className="knowledge-list" aria-label="Arquivos da base de conhecimento">{state.documents.map((document) => <article className="knowledge-document" key={document.id}><span className="knowledge-file-icon">{fileIcon(document.format)}</span><span className="knowledge-document-copy"><strong>{document.name}</strong><small>{formatLabels[document.format]} · {document.origin}</small>{document.processingError && <small className="knowledge-error-text">{document.processingError}</small>}</span><span className={`knowledge-status ${document.processingStatus.toLowerCase()}`} title={documentStatusLabels[document.processingStatus]}>{statusIcon(document.processingStatus)}<small>{documentStatusLabels[document.processingStatus]}</small></span><DocumentRagReplaceButton document={document} state={state} setState={setState} demoMode={demoMode} workspaceId={workspaceId} onRefresh={onRefresh} /><button className="knowledge-document-remove" type="button" aria-label={`Remover ${document.name}`} title={`Remover ${document.name}`} disabled={busy} onClick={() => removeDocument(document)}><Trash2 size={15} /></button></article>)}</div>
  </div>;
}

function OnboardingPanel({ state, setState, demoMode, workspaceId, onRefresh }: { state: KnowledgeFixtureState; setState: KnowledgeStateSetter; demoMode: boolean; workspaceId: string; onRefresh: () => Promise<void> }) {
  const progress = onboardingProgress(state.onboarding);
  const question = onboardingQuestions[state.onboarding.questionIndex] ?? onboardingQuestions.at(-1);
  const [answer, setAnswer] = useState(question ? state.onboarding.answers[question.id] ?? "" : "");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const save = async () => {
    if (!question) return;
    if (demoMode) {
      const onboarding = answerOnboardingQuestion(state.onboarding, question.id, answer);
      setState((current) => ({ ...current, onboarding, brand: buildBrandProfile({ workspaceId: onboarding.workspaceId, onboarding, facts: current.facts }) }));
      setAnswer("");
      return;
    }
    setSaving(true);
    setNotice(null);
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/knowledge/onboarding`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ questionId: question.id, answer }) });
      const payload = await response.json().catch(() => ({})) as { message?: string };
      if (!response.ok) throw new Error(payload.message || "Não foi possível salvar esta resposta.");
      setAnswer("");
      setNotice("Resposta salva no contexto do workspace.");
      await onRefresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Não foi possível salvar esta resposta agora.");
    } finally {
      setSaving(false);
    }
  };
  return <div className="knowledge-panel-stack"><div className="knowledge-progress"><div><span>Contexto do workspace</span><strong>{progress.answered} de {progress.total}</strong></div><div className="knowledge-progress-bar"><span style={{ width: `${progress.percentage}%` }} /></div></div>{question && state.onboarding.status !== "COMPLETE" ? <section className="knowledge-question"><p className="eyebrow">PERGUNTA {state.onboarding.questionIndex + 1}</p><h2>{question.prompt}</h2><p>{question.hint}</p><textarea value={answer} disabled={saving} onChange={(event) => setAnswer(event.target.value)} placeholder="Escreva do seu jeito…" rows={4} /><button className="primary-button" type="button" onClick={() => void save()} disabled={!answer.trim() || saving}>{saving ? "Salvando…" : "Salvar resposta"}</button>{notice && <p className="knowledge-notice" role="status">{notice}</p>}</section> : <div className="knowledge-success"><CheckCircle2 size={19} /><strong>Resumo pronto</strong><p>{state.onboarding.summary}</p><small>{state.onboarding.nextStep}</small></div>}</div>;
}

function SearchPanel({ state, demoMode, workspaceId }: { state: KnowledgeFixtureState; demoMode: boolean; workspaceId: string }) {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [remoteResults, setRemoteResults] = useState<KnowledgeFixtureState["chunks"]>([]);
  const [remoteEvidence, setRemoteEvidence] = useState<"FOUND" | "INSUFFICIENT">("INSUFFICIENT");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const localResults = useMemo(() => {
    if (!submitted.trim()) return [];
    const terms = submitted.toLocaleLowerCase("pt-BR").split(/\s+/).filter((term) => term.length > 2);
    return state.chunks.filter((chunk) => terms.some((term) => chunk.content.toLocaleLowerCase("pt-BR").includes(term))).slice(0, 5);
  }, [state.chunks, submitted]);
  const submit = async () => {
    setSubmitted(query);
    if (demoMode || !query.trim()) return;
    setSearching(true);
    setSearchError(null);
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/knowledge/search`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query }) });
      const payload = await response.json().catch(() => ({})) as { message?: string; result?: { evidence?: "FOUND" | "INSUFFICIENT"; chunks?: KnowledgeFixtureState["chunks"] } };
      if (!response.ok) throw new Error(payload.message || "Não foi possível consultar a base agora.");
      setRemoteResults(payload.result?.chunks ?? []);
      setRemoteEvidence(payload.result?.evidence ?? "INSUFFICIENT");
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : "Não foi possível consultar a base agora.");
      setRemoteResults([]);
      setRemoteEvidence("INSUFFICIENT");
    } finally {
      setSearching(false);
    }
  };
  const results = demoMode ? localResults : remoteResults;
  const evidenceFound = demoMode ? localResults.length > 0 : remoteEvidence === "FOUND";
  return <div className="knowledge-panel-stack"><div className="knowledge-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void submit(); }} placeholder="Pergunte à base autorizada" /><button type="button" onClick={() => void submit()} aria-label="Buscar evidências" title="Buscar evidências" disabled={searching}><Search size={15} /></button></div><p className="knowledge-notice"><ShieldCheck size={14} /> O filtro de workspace e permissão acontece antes da evidência chegar ao agente.</p>{searchError && <p className="knowledge-error-text" role="alert">{searchError}</p>}{submitted && <div className="knowledge-search-result-heading"><span>Resultado para “{submitted}”</span><strong>{evidenceFound ? "Evidência encontrada" : "Evidência insuficiente"}</strong></div>}{results.length ? <div className="knowledge-results">{results.map((chunk) => <article className="knowledge-result" key={chunk.id}><div><strong>{chunk.sourceName}</strong><small>{chunk.titlePath}</small></div><p>{chunk.content}</p><span>Página/seção rastreável · score local {chunk.score?.toFixed(2) ?? "—"}</span></article>)}</div> : submitted ? <div className="knowledge-empty"><AlertTriangle size={20} /><strong>Não encontramos evidência suficiente.</strong><span>O agente deve pedir mais contexto, não inventar uma resposta.</span></div> : <div className="knowledge-empty"><BookOpenText size={20} /><span>Digite uma pergunta para consultar trechos já normalizados e indexados.</span></div>}</div>;
}

function ReviewPanel({ state, setState, demoMode, workspaceId, onRefresh }: { state: KnowledgeFixtureState; setState: KnowledgeStateSetter; demoMode: boolean; workspaceId: string; onRefresh: () => Promise<void> }) {
  const [notice, setNotice] = useState<string | null>(null);
  const decide = (conflict: KnowledgeConflict, status: "RESOLVED" | "DISMISSED") => {
    if (demoMode) {
      const updated = decideKnowledgeConflict(conflict, status);
      const conflicts = state.conflicts.map((item) => item.id === conflict.id ? updated : item);
      const facts = state.facts.map((fact) => fact.key === conflict.factKey && status === "RESOLVED" ? { ...fact, status: "VERIFIED" as const } : fact);
      setState((current) => ({ ...current, conflicts, facts, brand: buildBrandProfile({ workspaceId: current.onboarding.workspaceId, onboarding: current.onboarding, facts }) }));
      return;
    }
    void (async () => {
      setNotice(null);
      try {
        const response = await fetch(`/api/workspaces/${workspaceId}/knowledge/conflicts`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ conflictId: conflict.id, status }) });
        const payload = await response.json().catch(() => ({})) as { message?: string };
        if (!response.ok) throw new Error(payload.message || "Não foi possível registrar a decisão.");
        setNotice("Decisão registrada no histórico do workspace.");
        await onRefresh();
      } catch (error) {
        setNotice(error instanceof Error ? error.message : "Não foi possível registrar a decisão agora.");
      }
    })();
  };
  const open = state.conflicts.filter((conflict) => conflict.status === "OPEN");
  return <div className="knowledge-panel-stack"><div className="knowledge-callout"><AlertTriangle size={17} /><span><strong>Fontes conflitantes ficam visíveis</strong><small>Uma decisão humana registra qual informação deve prevalecer ou se a revisão fica para depois.</small></span></div>{notice && <p className="knowledge-notice" role="status">{notice}</p>}{open.length ? open.map((conflict) => <article className="knowledge-conflict" key={conflict.id}><p className="eyebrow">{conflict.factKey}</p><div><p><strong>{conflict.statementA}</strong><small>{conflict.sourceA}</small></p><p><strong>{conflict.statementB}</strong><small>{conflict.sourceB}</small></p></div><div className="knowledge-actions"><button className="primary-button" type="button" onClick={() => decide(conflict, "RESOLVED")}>Marcar revisado</button><button className="secondary-button" type="button" onClick={() => decide(conflict, "DISMISSED")}>Manter para depois</button></div></article>) : <div className="knowledge-success"><CheckCircle2 size={19} /><strong>Nenhum conflito aberto</strong><p>As decisões verificadas podem alimentar o perfil de trabalho.</p></div>}</div>;
}

function BrandPanel({ state }: { state: KnowledgeFixtureState }) {
  const label = brandReadinessLabel(state.brand.readiness);
  return <div className="knowledge-panel-stack"><div className={`knowledge-readiness ${state.brand.readiness}`}><Sparkles size={18} /><span><strong>{label}</strong><small>O perfil só fica pronto quando o onboarding e as decisões importantes estiverem claros.</small></span></div><dl className="knowledge-brand-list"><div><dt>Público</dt><dd>{state.brand.audience}</dd></div><div><dt>Tom</dt><dd>{state.brand.tone}</dd></div><div><dt>Regras verificadas</dt><dd>{state.brand.rules.length ? state.brand.rules.map((rule) => <span key={rule}>{rule}</span>) : "Ainda não há regras verificadas."}</dd></div></dl></div>;
}

export function KnowledgeDrawer({ open, setOpen, workspaceId, demoMode = false }: { open: boolean; setOpen: (open: boolean) => void; workspaceId: string; demoMode?: boolean }) {
  const [tab, setTab] = useState<KnowledgeTab>("files");
  const [state, setState] = useState<KnowledgeFixtureState>(() => demoMode ? createKnowledgeFixtures(workspaceId) : emptyKnowledgeState(workspaceId));
  const [loading, setLoading] = useState(!demoMode);
  const [error, setError] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    if (demoMode) {
      setState(createKnowledgeFixtures(workspaceId));
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/knowledge`, { cache: "no-store" });
      const payload = await response.json().catch(() => ({})) as { message?: string; snapshot?: unknown };
      if (!response.ok || !payload.snapshot) throw new Error(payload.message || "Não foi possível carregar a base de conhecimento.");
      setState(stateFromSnapshot(workspaceId, payload.snapshot));
    } catch (caught) {
      setState(emptyKnowledgeState(workspaceId));
      setError(caught instanceof Error ? caught.message : "Não foi possível carregar a base de conhecimento agora.");
    } finally {
      setLoading(false);
    }
  }, [demoMode, workspaceId]);
  useEffect(() => {
    const timer = window.setTimeout(() => void refresh(), 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);
  return <Drawer open={open} onOpenChange={setOpen}><DrawerContent scrollable className="knowledge-drawer"><DrawerHeader><DrawerDescription><BookOpenText size={14} /> Onboarding · conhecimento</DrawerDescription><DrawerTitle>Base de conhecimento</DrawerTitle></DrawerHeader><div className="drawer-workspace-context"><p className="eyebrow">CONTEXTO DO WORKSPACE</p><h2>Informação útil, com origem</h2><p>Arquivos, respostas e decisões seguem rastreáveis antes de qualquer agente receber contexto.</p></div>{loading && <div className="platform-state loading"><RefreshCw className="spin" size={16} /> Carregando base de conhecimento…</div>}{error && <div className="platform-state error" role="alert"><AlertTriangle size={16} /><span>{error}</span><button className="text-button" type="button" onClick={() => void refresh()}>Tentar carregar novamente</button></div>}{!loading && <><div className="knowledge-tabs" role="tablist" aria-label="Seções da base de conhecimento">{(Object.keys(tabLabels) as KnowledgeTab[]).map((item) => <button key={item} type="button" role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{tabLabels[item]}</button>)}</div>{tab === "files" && <FilesPanel state={state} setState={setState} demoMode={demoMode} workspaceId={workspaceId} onRefresh={refresh} />}{tab === "onboarding" && <OnboardingPanel state={state} setState={setState} demoMode={demoMode} workspaceId={workspaceId} onRefresh={refresh} />}{tab === "search" && <SearchPanel state={state} demoMode={demoMode} workspaceId={workspaceId} />}{tab === "review" && <ReviewPanel state={state} setState={setState} demoMode={demoMode} workspaceId={workspaceId} onRefresh={refresh} />}{tab === "brand" && <BrandPanel state={state} />}<p className="knowledge-footnote"><Headphones size={13} /> Áudio pode ser armazenado desde já; a interpretação só aparece como disponível depois de Whisper + revisão no GPT-5.6 Luna.</p></>}</DrawerContent></Drawer>;
}
