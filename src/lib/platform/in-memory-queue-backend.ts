import type { PhysicalQueue, QueueBackend, QueueFailureResult, QueueJob, QueueJobError, QueueJobState, QueueLease, QueuePriority } from "./contracts";

const priorityRank: Record<QueuePriority, number> = { URGENT: 0, HIGH: 1, NORMAL: 2, LOW: 3 };
const agingIntervalMs = 5 * 60_000;
const defaultLeaseDurationMs = 30_000;
const defaultRetryBackoffMs = [2_000, 5_000, 15_000, 45_000];
const terminalStates = new Set<QueueJobState>(["SUCCEEDED", "FAILED", "CANCELLED", "DEAD_LETTER"]);
const nonBlockingStates = new Set<QueueJobState>(["WAITING_USER", "WAITING_APPROVAL"]);

type StoredJob = QueueJob & {
  readyAt: number;
  sequence: number;
  lease?: QueueLease;
};

type QueueBackendOptions = {
  maxDepth?: number;
  maxDepthByWorkspace?: Record<string, number>;
  maxDepthByResource?: Partial<Record<PhysicalQueue, number>>;
  maxDepthByJobType?: Record<string, number>;
  workspaceWeights?: Record<string, number>;
  leaseDurationMs?: number;
  retryBackoffMs?: number[];
};

export class QueueSaturatedError extends Error {
  readonly code = "QUEUE_SATURATED";
  readonly recovery = "Aguarde uma vaga ou tente novamente quando houver capacidade.";

  constructor() {
    super("A fila atingiu o limite de segurança; aguarde uma vaga ou tente novamente.");
    this.name = "QueueSaturatedError";
  }
}

/**
 * Adapter determinístico para desenvolvimento local. Redis e o worker real
 * permanecem atrás de QueueBackend; esta implementação concentra a política
 * observável da fila e permite testá-la sem serviço externo.
 */
export function createInMemoryQueueBackend(options: QueueBackendOptions = {}): QueueBackend {
  const jobs = new Map<string, StoredJob>();
  const idempotency = new Map<string, string>();
  const fairnessCursor = new Map<PhysicalQueue, number>();
  const maxDepth = options.maxDepth ?? 100;
  const leaseDurationMs = options.leaseDurationMs ?? defaultLeaseDurationMs;
  const retryBackoffMs = options.retryBackoffMs ?? defaultRetryBackoffMs;
  let sequence = 0;

  const matchesWorkspace = (job: StoredJob, workspaceId?: string) => !workspaceId || job.workspaceId === workspaceId;
  const isQueueable = (state: QueueJobState) => state === "PENDING" || state === "READY" || state === "RETRY_SCHEDULED" || state === "RUNNING";
  const activeJobs = (resourceClass?: PhysicalQueue, workspaceId?: string) => [...jobs.values()].filter((job) => isQueueable(job.state) && matchesWorkspace(job, workspaceId) && (!resourceClass || job.resourceClass === resourceClass));
  const readyJobs = (resourceClass: PhysicalQueue, workspaceId?: string) => [...jobs.values()].filter((job) => job.state === "READY" && job.resourceClass === resourceClass && matchesWorkspace(job, workspaceId));
  const idempotencyKeyFor = (job: QueueJob) => job.idempotencyKey ? `${job.workspaceId}:${job.idempotencyKey}` : null;

  const toPublicJob = (job: StoredJob): QueueJob => {
    const { readyAt: _readyAt, sequence: _sequence, lease: _lease, ...publicJob } = job;
    return { ...publicJob, leaseUntil: job.lease?.leaseUntil };
  };

  const effectivePriority = (job: StoredJob, now: number) => {
    const rank = priorityRank[job.priority];
    if (rank === 0) return 0;
    const aging = Math.floor(Math.max(0, now - job.readyAt) / agingIntervalMs);
    const interactiveBoost = job.logicalQueue === "leader_session" ? 1 : 0;
    return Math.max(1, rank - interactiveBoost - aging);
  };

  const promoteDueJobs = (now: number) => {
    for (const job of jobs.values()) {
      if ((job.state === "PENDING" || job.state === "RETRY_SCHEDULED") && job.availableAt <= now) {
        job.state = "READY";
        job.readyAt = job.availableAt;
        job.sequence = ++sequence;
        job.updatedAt = now;
      }
    }
  };

  const recoverExpiredLeases = (now: number) => {
    for (const job of jobs.values()) {
      if (job.state !== "RUNNING" || !job.lease || job.lease.leaseUntil > now) continue;
      const error: QueueJobError = {
        code: "LEASE_EXPIRED",
        message: "O worker deixou de responder antes de confirmar a tarefa.",
        retryable: job.attempt < job.maxAttempts,
        occurredAt: now,
      };
      job.lastError = error;
      job.lease = undefined;
      job.leaseUntil = undefined;
      job.updatedAt = now;
      if (job.attempt < job.maxAttempts) {
        job.state = "RETRY_SCHEDULED";
        job.availableAt = now;
        job.readyAt = now;
      } else {
        job.state = "DEAD_LETTER";
      }
    }
  };

  const advance = (now: number) => {
    recoverExpiredLeases(now);
    promoteDueJobs(now);
  };

  const workspaceSlots = (candidates: StoredJob[]) => {
    const workspaces = [...new Set(candidates.map((job) => job.workspaceId))].sort((left, right) => {
      const leftFirst = candidates.filter((job) => job.workspaceId === left).sort(compareReadyJobs)[0];
      const rightFirst = candidates.filter((job) => job.workspaceId === right).sort(compareReadyJobs)[0];
      return (leftFirst?.sequence ?? 0) - (rightFirst?.sequence ?? 0);
    });
    return workspaces.flatMap((workspaceId) => Array.from({ length: Math.max(1, options.workspaceWeights?.[workspaceId] ?? 1) }, () => workspaceId));
  };

  const compareReadyJobs = (left: StoredJob, right: StoredJob) => left.readyAt - right.readyAt || left.sequence - right.sequence;

  const chooseFairJob = (candidates: StoredJob[], resourceClass: PhysicalQueue, now: number) => {
    const bestRank = Math.min(...candidates.map((job) => effectivePriority(job, now)));
    const highestPriority = candidates.filter((job) => effectivePriority(job, now) === bestRank);
    const slots = workspaceSlots(highestPriority);
    if (!slots.length) return highestPriority.sort(compareReadyJobs)[0];
    const cursor = fairnessCursor.get(resourceClass) ?? 0;
    for (let offset = 0; offset < slots.length; offset += 1) {
      const index = (cursor + offset) % slots.length;
      const workspaceId = slots[index];
      const match = highestPriority.filter((job) => job.workspaceId === workspaceId).sort(compareReadyJobs)[0];
      if (match) {
        fairnessCursor.set(resourceClass, (index + 1) % slots.length);
        return match;
      }
    }
    return highestPriority.sort(compareReadyJobs)[0];
  };

  const checkCapacity = (job: QueueJob) => {
    const resourceLimit = options.maxDepthByResource?.[job.resourceClass] ?? maxDepth;
    const resourceDepth = activeJobs(job.resourceClass).length;
    const workspaceLimit = options.maxDepthByWorkspace?.[job.workspaceId];
    const workspaceDepth = activeJobs(undefined, job.workspaceId).length;
    const typeLimit = options.maxDepthByJobType?.[job.jobType];
    const typeDepth = activeJobs(undefined).filter((item) => item.jobType === job.jobType).length;
    if (resourceDepth >= resourceLimit || (workspaceLimit !== undefined && workspaceDepth >= workspaceLimit) || (typeLimit !== undefined && typeDepth >= typeLimit)) throw new QueueSaturatedError();
  };

  const findLease = (leaseId: string, workerId: string) => [...jobs.values()].find((job) => job.lease?.leaseId === leaseId && job.lease.workerId === workerId);

  return {
    async enqueue(job) {
      const dedupeKey = idempotencyKeyFor(job);
      if (dedupeKey) {
        const existingId = idempotency.get(dedupeKey);
        const existing = existingId ? jobs.get(existingId) : undefined;
        if (existing) return { job: toPublicJob(existing), deduplicated: true };
      }
      checkCapacity(job);
      const now = Date.now();
      const createdAt = job.createdAt ?? now;
      const availableAt = job.availableAt ?? createdAt;
      const ready = availableAt <= now;
      const stored: StoredJob = {
        ...job,
        state: ready ? "READY" : "PENDING",
        createdAt,
        updatedAt: now,
        availableAt,
        attempt: 0,
        maxAttempts: Math.max(1, job.maxAttempts),
        readyAt: ready ? availableAt : Number.POSITIVE_INFINITY,
        sequence: ++sequence,
      };
      jobs.set(job.id, stored);
      if (dedupeKey) idempotency.set(dedupeKey, job.id);
      return { job: toPublicJob(stored), deduplicated: false };
    },

    async claim({ resourceClass, workerId, now = Date.now() }) {
      advance(now);
      const candidates = readyJobs(resourceClass);
      const next = candidates.length ? chooseFairJob(candidates, resourceClass, now) : undefined;
      if (!next) return null;
      next.state = "RUNNING";
      next.attempt += 1;
      next.updatedAt = now;
      const lease: QueueLease = {
        ...toPublicJob(next),
        state: "RUNNING",
        leaseId: `${next.id}:lease:${next.attempt}`,
        workerId,
        leasedAt: now,
        heartbeatAt: now,
        leaseUntil: now + leaseDurationMs,
      };
      next.lease = lease;
      next.leaseUntil = lease.leaseUntil;
      return lease;
    },

    async heartbeat({ leaseId, workerId, now = Date.now() }) {
      const stored = findLease(leaseId, workerId);
      if (!stored?.lease || stored.lease.leaseUntil <= now) {
        advance(now);
        return false;
      }
      stored.lease.heartbeatAt = now;
      stored.lease.leaseUntil = now + leaseDurationMs;
      stored.leaseUntil = stored.lease.leaseUntil;
      stored.updatedAt = now;
      return true;
    },

    async complete({ leaseId, workerId, now = Date.now() }) {
      const stored = findLease(leaseId, workerId);
      if (!stored?.lease || stored.lease.leaseUntil <= now) {
        advance(now);
        return false;
      }
      stored.state = "SUCCEEDED";
      stored.updatedAt = now;
      stored.lease = undefined;
      stored.leaseUntil = undefined;
      stored.availableAt = now;
      return true;
    },

    async fail({ leaseId, workerId, technical, now = Date.now(), retryAfterMs, error }) {
      const stored = findLease(leaseId, workerId);
      if (!stored?.lease || stored.lease.leaseUntil <= now) {
        advance(now);
        return { state: "RETRY_SCHEDULED", retried: false, deadLettered: false } satisfies QueueFailureResult;
      }
      const failure = error ?? {
        code: technical ? "TECHNICAL_FAILURE" : "SEMANTIC_FAILURE",
        message: technical ? "A tentativa encontrou uma falha recuperável." : "O resultado precisa voltar para planejamento.",
        retryable: technical,
        occurredAt: now,
      } satisfies QueueJobError;
      stored.lastError = failure;
      stored.updatedAt = now;
      stored.lease = undefined;
      stored.leaseUntil = undefined;
      if (!technical || !failure.retryable) {
        stored.state = "FAILED";
        return { state: "FAILED", retried: false, deadLettered: false } satisfies QueueFailureResult;
      }
      if (stored.attempt >= stored.maxAttempts) {
        stored.state = "DEAD_LETTER";
        return { state: "DEAD_LETTER", retried: false, deadLettered: true } satisfies QueueFailureResult;
      }
      const delay = retryAfterMs ?? retryBackoffMs[Math.min(stored.attempt - 1, retryBackoffMs.length - 1)] ?? defaultRetryBackoffMs[defaultRetryBackoffMs.length - 1];
      stored.state = "RETRY_SCHEDULED";
      stored.availableAt = now + Math.max(0, delay);
      stored.readyAt = stored.availableAt;
      stored.sequence = ++sequence;
      return { state: "RETRY_SCHEDULED", retried: true, deadLettered: false, retryAt: stored.availableAt } satisfies QueueFailureResult;
    },

    async wait({ leaseId, workerId, state, reason, checkpoint, now = Date.now() }) {
      const stored = findLease(leaseId, workerId);
      if (!stored?.lease || stored.lease.leaseUntil <= now) {
        advance(now);
        return false;
      }
      stored.state = state;
      stored.waitReason = reason;
      stored.checkpoint = checkpoint;
      stored.updatedAt = now;
      stored.lease = undefined;
      stored.leaseUntil = undefined;
      return true;
    },

    async resume({ jobId, workspaceId, now = Date.now() }) {
      const job = jobs.get(jobId);
      if (!job || job.workspaceId !== workspaceId || !nonBlockingStates.has(job.state)) return false;
      job.state = "READY";
      job.availableAt = now;
      job.readyAt = now;
      job.sequence = ++sequence;
      job.waitReason = undefined;
      job.updatedAt = now;
      return true;
    },

    async cancel({ jobId, workspaceId, reason }) {
      const job = jobs.get(jobId);
      if (!job || job.workspaceId !== workspaceId || terminalStates.has(job.state)) return false;
      job.state = "CANCELLED";
      job.cancelReason = reason;
      job.updatedAt = Date.now();
      job.lease = undefined;
      job.leaseUntil = undefined;
      return true;
    },

    async cancelCascade({ rootJobId, workspaceId, reason }) {
      const root = jobs.get(rootJobId);
      if (!root || root.workspaceId !== workspaceId) return 0;
      const lineage = new Set([root.id, root.runId]);
      let cancelled = 0;
      let foundNewChild = true;
      while (foundNewChild) {
        foundNewChild = false;
        for (const job of jobs.values()) {
          const isRoot = job.id === rootJobId;
          const isChild = Boolean(job.parentRunId && lineage.has(job.parentRunId));
          if (job.workspaceId !== workspaceId || terminalStates.has(job.state) || (!isRoot && !isChild)) continue;
          if (!isRoot) {
            lineage.add(job.id);
            lineage.add(job.runId);
            foundNewChild = true;
          }
          job.state = "CANCELLED";
          job.cancelReason = reason;
          job.updatedAt = Date.now();
          job.lease = undefined;
          job.leaseUntil = undefined;
          cancelled += 1;
        }
      }
      return cancelled;
    },

    async reprocess({ jobId, workspaceId, now = Date.now() }) {
      const job = jobs.get(jobId);
      if (!job || job.workspaceId !== workspaceId || job.state !== "DEAD_LETTER") return false;
      job.state = "READY";
      job.attempt = 0;
      job.availableAt = now;
      job.readyAt = now;
      job.sequence = ++sequence;
      job.updatedAt = now;
      return true;
    },

    async list({ workspaceId, resourceClass, states, now = Date.now() }) {
      advance(now);
      const allowedStates = states ? new Set(states) : null;
      return [...jobs.values()]
        .filter((job) => matchesWorkspace(job, workspaceId) && (!resourceClass || job.resourceClass === resourceClass) && (!allowedStates || allowedStates.has(job.state)))
        .sort((left, right) => left.createdAt - right.createdAt || left.sequence - right.sequence)
        .map(toPublicJob);
    },

    async depth({ resourceClass, workspaceId, now = Date.now() }) {
      advance(now);
      return readyJobs(resourceClass, workspaceId).length + [...jobs.values()].filter((job) => (job.state === "PENDING" || job.state === "RETRY_SCHEDULED") && job.resourceClass === resourceClass && matchesWorkspace(job, workspaceId)).length;
    },

    async deadLetters({ workspaceId }) {
      return (await this.list({ workspaceId, states: ["DEAD_LETTER"] })).filter((job) => job.state === "DEAD_LETTER");
    },
  };
}
