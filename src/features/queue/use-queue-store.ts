"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createInMemoryQueueBackend } from "@/lib/platform/in-memory-queue-backend";
import type { PhysicalQueue, QueueBackend, QueueJob, QueueLease, QueueJobState } from "@/lib/platform/contracts";
import { createQueueFixtures, createQueueJob } from "./queue-domain";

const resourceClasses: PhysicalQueue[] = ["CPU", "LLM", "GPU", "BROWSER", "RENDER"];

function operationError(error: unknown) {
  return error instanceof Error ? error.message : "Não foi possível atualizar a fila agora.";
}

export function useQueueStore(workspaceId: string, demoMode = false) {
  const backend = useMemo<QueueBackend>(() => createInMemoryQueueBackend({ maxDepthByWorkspace: { [workspaceId]: 100 } }), [workspaceId]);
  const [jobs, setJobs] = useState<QueueJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState("Fila pronta para acompanhar");
  const leasesRef = useRef(new Map<string, QueueLease>());
  const seededBackendRef = useRef<QueueBackend | null>(null);
  const failNextLoadRef = useRef(false);

  const refresh = useCallback(async () => {
    const nextJobs = await backend.list({ workspaceId });
    setJobs(nextJobs);
    const activeIds = new Set(nextJobs.filter((job) => job.state === "RUNNING").map((job) => job.id));
    for (const jobId of leasesRef.current.keys()) if (!activeIds.has(jobId)) leasesRef.current.delete(jobId);
    setSelectedJobId((current) => current && nextJobs.some((job) => job.id === current) ? current : nextJobs[0]?.id ?? null);
    return nextJobs;
  }, [backend, workspaceId]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    await new Promise((resolve) => window.setTimeout(resolve, 80));
    if (failNextLoadRef.current) {
      failNextLoadRef.current = false;
      setError("A fila não respondeu. As tarefas já carregadas continuam disponíveis.");
      setLoading(false);
      return;
    }
    try {
      if (seededBackendRef.current !== backend) {
        seededBackendRef.current = backend;
        if (demoMode) {
          for (const fixture of createQueueFixtures(workspaceId)) await backend.enqueue(fixture);
        }
      }
      await refresh();
      setLoading(false);
    } catch (caught) {
      setError(operationError(caught));
      setLoading(false);
    }
  }, [backend, demoMode, refresh, workspaceId]);

  useEffect(() => {
    leasesRef.current.clear();
    const timer = window.setTimeout(() => {
      setJobs([]);
      setSelectedJobId(null);
      void load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const runOperation = useCallback(async (operation: () => Promise<void>, successMessage: string) => {
    setError(null);
    try {
      await operation();
      await refresh();
      setNotice(successMessage);
    } catch (caught) {
      setError(operationError(caught));
    }
  }, [refresh]);

  const claimNext = useCallback(async () => {
    setError(null);
    try {
      for (const resourceClass of resourceClasses) {
        const lease = await backend.claim({ resourceClass, workerId: `local-worker-${resourceClass.toLowerCase()}` });
        if (!lease) continue;
        leasesRef.current.set(lease.id, lease);
        setSelectedJobId(lease.id);
        await refresh();
        setNotice(`${lease.jobType} assumida pelo worker local`);
        return;
      }
      setNotice("Não há tarefa pronta para começar");
    } catch (caught) {
      setError(operationError(caught));
    }
  }, [backend, refresh]);

  const selectedJob = useMemo(() => jobs.find((job) => job.id === selectedJobId) ?? null, [jobs, selectedJobId]);

  const completeSelected = useCallback(() => {
    if (!selectedJobId) return;
    return runOperation(async () => {
      const lease = leasesRef.current.get(selectedJobId);
      if (!lease || !(await backend.complete({ leaseId: lease.leaseId, workerId: lease.workerId }))) throw new Error("A tarefa não está mais reservada por este worker.");
    }, "Tarefa concluída e registrada");
  }, [backend, runOperation, selectedJobId]);

  const waitSelected = useCallback((state: Extract<QueueJobState, "WAITING_USER" | "WAITING_APPROVAL">) => {
    if (!selectedJobId) return;
    return runOperation(async () => {
      const lease = leasesRef.current.get(selectedJobId);
      if (!lease || !(await backend.wait({ leaseId: lease.leaseId, workerId: lease.workerId, state, reason: state === "WAITING_USER" ? "Falta uma informação para continuar." : "Uma decisão humana é necessária antes da próxima etapa.", checkpoint: { jobId: selectedJobId, savedAt: Date.now() } }))) throw new Error("A tarefa não está mais reservada por este worker.");
    }, state === "WAITING_USER" ? "A tarefa está aguardando sua resposta" : "A tarefa está aguardando sua aprovação");
  }, [backend, runOperation, selectedJobId]);

  const failSelected = useCallback((technical: boolean) => {
    if (!selectedJobId) return;
    return runOperation(async () => {
      const lease = leasesRef.current.get(selectedJobId);
      if (!lease) throw new Error("Assuma a tarefa novamente antes de registrar o resultado.");
      const result = await backend.fail({ leaseId: lease.leaseId, workerId: lease.workerId, technical });
      if (result.state === "RETRY_SCHEDULED") setNotice("Falha recuperável: nova tentativa programada");
    }, technical ? "Falha recuperável registrada" : "Resultado enviado de volta para revisão");
  }, [backend, runOperation, selectedJobId]);

  const resumeSelected = useCallback(() => {
    if (!selectedJobId) return;
    return runOperation(async () => {
      if (!(await backend.resume({ jobId: selectedJobId, workspaceId }))) throw new Error("Esta tarefa não está aguardando uma ação humana.");
    }, "Tarefa liberada para continuar");
  }, [backend, runOperation, selectedJobId, workspaceId]);

  const cancelSelected = useCallback((cascade: boolean) => {
    if (!selectedJobId) return;
    return runOperation(async () => {
      const cancelled = cascade
        ? await backend.cancelCascade({ rootJobId: selectedJobId, workspaceId, reason: "Cancelamento solicitado no acompanhamento" })
        : Number(await backend.cancel({ jobId: selectedJobId, workspaceId, reason: "Cancelamento solicitado no acompanhamento" }));
      if (!cancelled) throw new Error("Esta tarefa já terminou ou não pertence a este workspace.");
    }, cascade ? "Tarefa e descendentes cancelados" : "Tarefa cancelada");
  }, [backend, runOperation, selectedJobId, workspaceId]);

  const reprocessSelected = useCallback(() => {
    if (!selectedJobId) return;
    return runOperation(async () => {
      if (!(await backend.reprocess({ jobId: selectedJobId, workspaceId }))) throw new Error("Só uma tarefa parada após tentativas pode ser reprocessada explicitamente.");
    }, "Tarefa reprocessada com nova tentativa controlada");
  }, [backend, runOperation, selectedJobId, workspaceId]);

  const enqueueDocumentJob = useCallback(() => {
    const now = Date.now();
    const id = `${workspaceId}-document-${now}`;
    return runOperation(async () => {
      await backend.enqueue(createQueueJob({
        id,
        workspaceId,
        runId: `${workspaceId}-manual-run-${now}`,
        jobType: "DOCUMENT_VALIDATE",
        logicalQueue: "workspace_capability",
        resourceClass: "CPU",
        priority: "NORMAL",
        createdAt: now,
        availableAt: now,
        maxAttempts: 4,
        idempotencyKey: `manual-document:${id}`,
        payload: { documentId: `document-${now}`, documentVersionId: `version-${now}`, checksum: "sha256:local-fixture" },
        origin: "Acompanhamento local",
        responsible: "Plataforma",
        nextStep: "Assumir a tarefa para validar o documento",
      }));
      setSelectedJobId(id);
    }, "Nova tarefa adicionada à fila");
  }, [backend, runOperation, workspaceId]);

  const simulateReadError = useCallback(() => {
    failNextLoadRef.current = true;
    void load();
  }, [load]);

  return {
    jobs,
    selectedJob,
    selectedJobId,
    setSelectedJobId,
    loading,
    error,
    notice,
    claimNext,
    completeSelected,
    waitSelected,
    failSelected,
    resumeSelected,
    cancelSelected,
    reprocessSelected,
    enqueueDocumentJob,
    refresh: load,
    simulateReadError,
  };
}
