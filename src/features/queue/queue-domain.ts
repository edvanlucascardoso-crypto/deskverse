import type { PhysicalQueue, QueueJob, QueueJobState, QueuePriority } from "@/lib/platform/contracts";

export const queueStateLabels: Record<QueueJobState, string> = {
  PENDING: "Ainda não liberada",
  READY: "Pronta para começar",
  RUNNING: "Em andamento",
  WAITING_USER: "Aguardando sua resposta",
  WAITING_APPROVAL: "Aguardando sua aprovação",
  RETRY_SCHEDULED: "Nova tentativa programada",
  SUCCEEDED: "Concluída",
  FAILED: "Precisa de revisão",
  CANCELLED: "Cancelada",
  DEAD_LETTER: "Parada após tentativas",
};

export const queuePriorityLabels: Record<QueuePriority, string> = {
  URGENT: "Urgente",
  HIGH: "Alta",
  NORMAL: "Normal",
  LOW: "Baixa",
};

export const resourceClassLabels: Record<PhysicalQueue, string> = {
  LLM: "raciocínio",
  CPU: "processamento",
  GPU: "imagem",
  BROWSER: "navegador",
  RENDER: "renderização",
};

const jobTypeLabels: Record<string, string> = {
  DOCUMENT_VALIDATE: "Validar documento",
  DOCUMENT_EXTRACT: "Extrair conteúdo",
  DOCUMENT_NORMALIZE: "Organizar conteúdo",
  DOCUMENT_CHUNK: "Separar trechos",
  DOCUMENT_EMBED: "Preparar busca semântica",
  DOCUMENT_INDEX: "Indexar documento",
  WORKSPACE_TASK: "Tarefa do workspace",
};

export function queueJobTypeLabel(jobType: string) {
  return jobTypeLabels[jobType] ?? jobType.replaceAll("_", " ").toLowerCase();
}

export function createQueueJob(input: Omit<QueueJob, "state" | "attempt"> & Partial<Pick<QueueJob, "state" | "attempt">>): QueueJob {
  return {
    ...input,
    state: input.state ?? "PENDING",
    attempt: input.attempt ?? 0,
  };
}

export function createQueueFixtures(workspaceId: string, now = Date.now()): QueueJob[] {
  return createKnowledgePipelineJobs({ workspaceId, documentId: "document-aurora", documentVersionId: "document-aurora-v1", checksum: "sha256:fixture-aurora", now });
}

const knowledgeStages = ["DOCUMENT_VALIDATE", "DOCUMENT_EXTRACT", "DOCUMENT_NORMALIZE", "DOCUMENT_CHUNK", "DOCUMENT_EMBED", "DOCUMENT_INDEX"] as const;

export function createKnowledgePipelineJobs(input: { workspaceId: string; documentId: string; documentVersionId: string; checksum: string; now?: number }): QueueJob[] {
  const now = input.now ?? Date.now();
  const baseRunId = `${input.workspaceId}:${input.documentVersionId}:knowledge`;
  return knowledgeStages.map((jobType, index) => {
    const runId = `${baseRunId}:${jobType}`;
    const parentRunId = index ? `${baseRunId}:${knowledgeStages[index - 1]}` : undefined;
    return createQueueJob({
      id: `${input.workspaceId}-${input.documentVersionId}-${jobType.toLowerCase()}`,
      workspaceId: input.workspaceId,
      runId,
      parentRunId,
      jobType,
      logicalQueue: "workspace_capability",
      resourceClass: "CPU",
      priority: index === 0 ? "HIGH" : index > 3 ? "LOW" : "NORMAL",
      createdAt: now - Math.max(0, 90_000 - index * 10_000),
      availableAt: index === 0 ? now - 90_000 : now + index * 60_000,
      maxAttempts: 4,
      idempotencyKey: `knowledge:${input.documentVersionId}:${jobType}`,
      payload: { documentId: input.documentId, documentVersionId: input.documentVersionId, checksum: input.checksum },
      origin: "Onboarding inicial",
      responsible: index < 2 ? "Plataforma" : "Worker de documentos",
      nextStep: index === 0 ? "Conferir o arquivo antes de extrair o conteúdo" : "A etapa anterior precisa terminar antes desta etapa",
    });
  });
}

export function queueStateTone(state: QueueJobState) {
  if (state === "SUCCEEDED") return "complete";
  if (state === "RUNNING") return "working";
  if (state === "WAITING_USER" || state === "WAITING_APPROVAL" || state === "RETRY_SCHEDULED" || state === "PENDING") return "waiting";
  if (state === "FAILED" || state === "CANCELLED" || state === "DEAD_LETTER") return "error";
  return "ready";
}
