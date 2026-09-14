import type { PhysicalQueue, QueueBackend, QueueJob, QueueLease, QueuePriority } from "./contracts";

const priorityRank: Record<QueuePriority, number> = { URGENT: 0, HIGH: 1, NORMAL: 2, LOW: 3 };

type StoredJob = QueueJob & { state: "queued" | "leased" | "completed" | "cancelled" | "dead-letter"; attempts: number; enqueuedAt: number; lease?: QueueLease };

const leaseDurationMs = 30_000;

/**
 * Deterministic adapter for local development. Redis remains behind QueueBackend
 * so the scheduler policy is owned by Deskverse and can be tested without Redis.
 */
export function createInMemoryQueueBackend(options: { maxDepth?: number } = {}): QueueBackend {
  const jobs = new Map<string, StoredJob>();
  const idempotency = new Map<string, string>();
  const maxDepth = options.maxDepth ?? 100;

  const queued = (physicalQueue: PhysicalQueue, workspaceId?: string) => [...jobs.values()].filter((job) => job.state === "queued" && job.physicalQueue === physicalQueue && (!workspaceId || job.workspaceId === workspaceId));

  return {
    async enqueue(job) {
      const dedupeKey = job.idempotencyKey ? `${job.workspaceId}:${job.idempotencyKey}` : null;
      if (dedupeKey) {
        const existingId = idempotency.get(dedupeKey);
        const existing = existingId ? jobs.get(existingId) : undefined;
        if (existing && ["queued", "leased", "completed"].includes(existing.state)) return { job: toPublicJob(existing), deduplicated: true };
      }
      if (queued(job.physicalQueue).length >= maxDepth) throw new Error("Fila em backpressure; tente novamente quando houver capacidade.");
      const stored: StoredJob = { ...job, state: "queued", attempts: 0, enqueuedAt: Date.now() };
      jobs.set(job.id, stored);
      if (dedupeKey) idempotency.set(dedupeKey, job.id);
      return { job, deduplicated: false };
    },
    async claim({ physicalQueue, workerId, now = Date.now() }) {
      const available = queued(physicalQueue).sort((left, right) => {
        const leftAgeBoost = Math.floor((now - left.enqueuedAt) / 30_000);
        const rightAgeBoost = Math.floor((now - right.enqueuedAt) / 30_000);
        return priorityRank[left.priority] - leftAgeBoost - (priorityRank[right.priority] - rightAgeBoost) || left.enqueuedAt - right.enqueuedAt;
      });
      const next = available[0];
      if (!next) return null;
      next.state = "leased";
      next.attempts += 1;
      const lease: QueueLease = { ...toPublicJob(next), leaseId: `${next.id}:lease:${next.attempts}`, workerId, attempts: next.attempts, leasedAt: now, heartbeatAt: now };
      next.lease = lease;
      return lease;
    },
    async heartbeat({ leaseId, workerId, now = Date.now() }) {
      const stored = [...jobs.values()].find((job) => job.lease?.leaseId === leaseId && job.lease?.workerId === workerId);
      if (!stored?.lease || now - stored.lease.heartbeatAt > leaseDurationMs) return false;
      stored.lease.heartbeatAt = now;
      return true;
    },
    async complete({ leaseId, workerId }) {
      const stored = [...jobs.values()].find((job) => job.lease?.leaseId === leaseId && job.lease?.workerId === workerId);
      if (!stored?.lease) return false;
      stored.state = "completed";
      return true;
    },
    async fail({ leaseId, workerId, technical, now = Date.now() }) {
      const stored = [...jobs.values()].find((job) => job.lease?.leaseId === leaseId && job.lease?.workerId === workerId);
      if (!stored?.lease) return { retried: false, deadLettered: false };
      if (technical && stored.attempts <= stored.maxRetries) {
        stored.state = "queued";
        stored.enqueuedAt = now;
        stored.lease = undefined;
        return { retried: true, deadLettered: false };
      }
      stored.state = "dead-letter";
      return { retried: false, deadLettered: true };
    },
    async cancel({ jobId, workspaceId }) {
      const job = jobs.get(jobId);
      if (!job || job.workspaceId !== workspaceId || ["completed", "cancelled", "dead-letter"].includes(job.state)) return false;
      job.state = "cancelled";
      return true;
    },
    async cancelCascade({ rootJobId, workspaceId }) {
      const root = jobs.get(rootJobId);
      if (!root || root.workspaceId !== workspaceId) return 0;
      let cancelled = 0;
      for (const job of jobs.values()) {
        if (job.workspaceId === workspaceId && job.state === "queued" && (job.id === rootJobId || job.payload.parentJobId === rootJobId)) {
          job.state = "cancelled";
          cancelled += 1;
        }
      }
      return cancelled;
    },
    async depth({ physicalQueue, workspaceId }) { return queued(physicalQueue, workspaceId).length; },
    async deadLetters({ workspaceId }) { return [...jobs.values()].filter((job) => job.state === "dead-letter" && (!workspaceId || job.workspaceId === workspaceId)).map(toPublicJob); },
  };
}

function toPublicJob(job: StoredJob): QueueJob {
  const { state: _state, attempts: _attempts, enqueuedAt: _enqueuedAt, lease: _lease, ...publicJob } = job;
  return publicJob;
}
