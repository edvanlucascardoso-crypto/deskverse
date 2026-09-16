"use client";

import { AlertTriangle, CheckCircle2, Database, RefreshCw, Trash2, X } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { createKnowledgeFixtures, type KnowledgeFixtureState } from "@/features/knowledge/knowledge-fixtures";
import { ragStatusLabels } from "@/features/knowledge/knowledge-domain";
import type { KnowledgeDocument, RagIndexStatus } from "@/types/knowledge";

type Action = "rebuild" | "delete";
type KnowledgeStateSetter = Dispatch<SetStateAction<KnowledgeFixtureState>>;

function actionCopy(action: Action) {
  return action === "rebuild" ? { title: "Apagar e criar um novo RAG", confirmation: "Confirmar apagar e criar novo RAG", message: "O RAG atual, seus chunks e embeddings serão apagados. Os arquivos originais e suas conversões continuarão disponíveis para criar a nova geração." } : { title: "Apagar RAG completamente", confirmation: "Confirmar apagar RAG", message: "Todos os chunks e embeddings serão removidos. Os arquivos originais continuarão no storage, mas não haverá evidência disponível até um novo RAG ser criado." };
}

export function RagControls({ state, setState, demoMode, workspaceId, onRefresh }: { state: KnowledgeFixtureState; setState: KnowledgeStateSetter; demoMode: boolean; workspaceId: string; onRefresh: () => Promise<void> }) {
  const [confirmation, setConfirmation] = useState<Action | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const copy = confirmation ? actionCopy(confirmation) : null;
  const run = async (action: Action) => {
    if (demoMode) {
      const fixture = createKnowledgeFixtures(workspaceId);
      setState((current) => ({ ...current, chunks: action === "rebuild" ? fixture.chunks : [], rag: { ...current.rag, generation: current.rag.generation + 1, status: action === "rebuild" && fixture.chunks.length ? "READY" : "EMPTY", lastAction: action, lastError: undefined, updatedAt: new Date().toISOString() } }));
      setNotice(action === "rebuild" ? "Novo RAG criado a partir dos documentos prontos." : "RAG apagado. Os arquivos continuam disponíveis para uma nova criação.");
      setConfirmation(null);
      return;
    }
    setBusy(true);
    setNotice(null);
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/knowledge/rag`, { method: action === "rebuild" ? "POST" : "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ confirmation: action === "rebuild" ? "APAGAR_E_CRIAR_NOVO_RAG" : "APAGAR_RAG_COMPLETAMENTE" }) });
      const payload = await response.json().catch(() => ({})) as { message?: string };
      if (!response.ok) throw new Error(payload.message || "Não foi possível atualizar o RAG.");
      setConfirmation(null);
      setNotice(action === "rebuild" ? "Novo RAG criado a partir dos documentos prontos." : "RAG apagado. Os arquivos continuam disponíveis para uma nova criação.");
      await onRefresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Não foi possível atualizar o RAG agora.");
    } finally {
      setBusy(false);
    }
  };
  const status = state.rag.status as RagIndexStatus;
  return <section className="knowledge-rag-control" aria-labelledby="knowledge-rag-title"><div className="knowledge-rag-heading"><div><p className="eyebrow">BASE VETORIAL</p><h2 id="knowledge-rag-title"><Database size={17} /> RAG do workspace</h2></div><span className={`knowledge-rag-status ${status.toLowerCase()}`}>{status === "READY" ? <CheckCircle2 size={14} /> : status === "FAILED" ? <AlertTriangle size={14} /> : <RefreshCw size={14} />}{ragStatusLabels[status]}</span></div><p>Geração {state.rag.generation}. A substituição sempre apaga os chunks e embeddings anteriores antes de criar a nova geração.</p>{state.rag.lastError && <small className="knowledge-error-text">{state.rag.lastError}</small>}<div className="knowledge-rag-actions"><button className="secondary-button" type="button" disabled={busy} onClick={() => setConfirmation("rebuild")}><RefreshCw size={15} /> Apagar e criar novo RAG</button>{status !== "EMPTY" && <button className="text-button knowledge-rag-delete" type="button" disabled={busy} onClick={() => setConfirmation("delete")}><Trash2 size={14} /> Apagar RAG</button>}</div>{notice && <p className="knowledge-notice" role="status">{notice}</p>}{copy && <div className="knowledge-rag-confirmation" role="alert"><div><strong>{copy.title}</strong><p>{copy.message}</p></div><div className="knowledge-actions"><button className="primary-button danger-button" type="button" disabled={busy} onClick={() => void run(confirmation ?? "rebuild")}>{busy ? "Atualizando…" : copy.confirmation}</button><button className="secondary-button" type="button" disabled={busy} onClick={() => setConfirmation(null)}><X size={15} /> Cancelar</button></div></div>}</section>;
}

export function documentRagActionLabel(document: KnowledgeDocument) {
  return `Substituir RAG de ${document.name}`;
}

export function DocumentRagReplaceButton({ document, state, setState, demoMode, workspaceId, onRefresh }: { document: KnowledgeDocument; state: KnowledgeFixtureState; setState: KnowledgeStateSetter; demoMode: boolean; workspaceId: string; onRefresh: () => Promise<void> }) {
  const [confirmation, setConfirmation] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const run = async () => {
    if (demoMode) {
      const fixture = createKnowledgeFixtures(workspaceId);
      const replacement = fixture.chunks.filter((chunk) => chunk.documentId === document.id);
      setState((current) => ({ ...current, chunks: [...current.chunks.filter((chunk) => chunk.documentId !== document.id), ...replacement], rag: { ...current.rag, status: "READY", lastAction: "document_replace", lastError: undefined, updatedAt: new Date().toISOString() } }));
      setNotice("RAG deste arquivo substituído.");
      setConfirmation(false);
      return;
    }
    setBusy(true);
    setNotice(null);
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/knowledge/documents/${document.id}/rag`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ confirmation: "SUBSTITUIR_RAG_DO_ARQUIVO" }) });
      const payload = await response.json().catch(() => ({})) as { message?: string };
      if (!response.ok) throw new Error(payload.message || "Não foi possível substituir o RAG deste arquivo.");
      setConfirmation(false);
      setNotice("RAG deste arquivo substituído.");
      await onRefresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Não foi possível substituir o RAG agora.");
    } finally {
      setBusy(false);
    }
  };
  return <span className="knowledge-document-rag-action"><button className="knowledge-document-replace" type="button" aria-label={documentRagActionLabel(document)} title={documentRagActionLabel(document)} disabled={busy || document.processingStatus !== "READY"} onClick={() => setConfirmation(true)}><RefreshCw size={15} /></button>{confirmation && <span className="knowledge-document-confirmation" role="alert"><strong>Substituir RAG deste arquivo?</strong><small>Os chunks e embeddings atuais deste documento serão removidos antes da nova indexação.</small><span><button className="primary-button danger-button" type="button" disabled={busy} onClick={() => void run()}>{busy ? "Substituindo…" : "Confirmar substituição"}</button><button className="secondary-button" type="button" disabled={busy} onClick={() => setConfirmation(false)}>Cancelar</button></span></span>}{notice && <small className="knowledge-document-action-notice" role="status">{notice}</small>}</span>;
}
