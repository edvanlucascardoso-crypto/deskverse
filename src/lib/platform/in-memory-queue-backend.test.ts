import { describe, expect, it } from "vitest";
import { createInMemoryQueueBackend, QueueSaturatedError } from "./in-memory-queue-backend";
import type { QueueJob } from "./contracts";

const job = (overrides: Partial<QueueJob> = {}): QueueJob => ({
  id: crypto.randomUUID(),
  workspaceId: "workspace-a",
  runId: crypto.randomUUID(),
  jobType: "WORKSPACE_TASK",
  logicalQueue: "workspace_capability",
  resourceClass: "LLM",
  priority: "NORMAL",
  state: "PENDING",
  createdAt: 0,
  availableAt: 0,
  attempt: 0,
  maxAttempts: 4,
  payload: {},
  ...overrides,
});

describe("in-memory QueueBackend", () => {
  it("deduplicates an idempotency key and keeps urgent ahead of normal work", async () => {
    const queue = createInMemoryQueueBackend();
    const first = await queue.enqueue(job({ id: "normal", idempotencyKey: "same" }));
    const duplicate = await queue.enqueue(job({ id: "duplicate", idempotencyKey: "same" }));
    await queue.enqueue(job({ id: "urgent", priority: "URGENT" }));

    expect(first.deduplicated).toBe(false);
    expect(duplicate.deduplicated).toBe(true);
    expect((await queue.claim({ resourceClass: "LLM", workerId: "worker", now: 0 }))?.id).toBe("urgent");
  });

  it("ages normal and low jobs one band every five minutes without creating urgent work", async () => {
    const queue = createInMemoryQueueBackend();
    await queue.enqueue(job({ id: "low", priority: "LOW", createdAt: 0, availableAt: 0 }));
    await queue.enqueue(job({ id: "normal", priority: "NORMAL", createdAt: 0, availableAt: 0 }));

    expect((await queue.claim({ resourceClass: "LLM", workerId: "worker", now: 5 * 60_000 }))?.id).toBe("normal");
    const lease = await queue.claim({ resourceClass: "LLM", workerId: "worker", now: 5 * 60_000 });
    expect(lease?.id).toBe("low");
    expect(lease?.priority).toBe("LOW");
  });

  it("rotates workspaces fairly within the same effective priority", async () => {
    const queue = createInMemoryQueueBackend();
    await queue.enqueue(job({ id: "a-1", workspaceId: "workspace-a" }));
    await queue.enqueue(job({ id: "a-2", workspaceId: "workspace-a" }));
    await queue.enqueue(job({ id: "b-1", workspaceId: "workspace-b" }));

    const first = await queue.claim({ resourceClass: "LLM", workerId: "worker", now: 0 });
    const second = await queue.claim({ resourceClass: "LLM", workerId: "worker", now: 0 });
    const third = await queue.claim({ resourceClass: "LLM", workerId: "worker", now: 0 });

    expect([first?.workspaceId, second?.workspaceId, third?.workspaceId]).toEqual(["workspace-a", "workspace-b", "workspace-a"]);
  });

  it("keeps FIFO order inside one workspace and prefers interactive work over background work", async () => {
    const queue = createInMemoryQueueBackend();
    await queue.enqueue(job({ id: "background", logicalQueue: "workspace_capability", priority: "NORMAL" }));
    await queue.enqueue(job({ id: "interactive", logicalQueue: "leader_session", priority: "NORMAL" }));
    await queue.enqueue(job({ id: "same-workspace-next", logicalQueue: "workspace_capability", priority: "NORMAL" }));

    expect((await queue.claim({ resourceClass: "LLM", workerId: "worker", now: 0 }))?.id).toBe("interactive");
    expect((await queue.claim({ resourceClass: "LLM", workerId: "worker", now: 0 }))?.id).toBe("background");
    expect((await queue.claim({ resourceClass: "LLM", workerId: "worker", now: 0 }))?.id).toBe("same-workspace-next");
  });

  it("respects weighted workspace rotation", async () => {
    const queue = createInMemoryQueueBackend({ workspaceWeights: { "workspace-a": 2, "workspace-b": 1 } });
    await queue.enqueue(job({ id: "a-1", workspaceId: "workspace-a" }));
    await queue.enqueue(job({ id: "a-2", workspaceId: "workspace-a" }));
    await queue.enqueue(job({ id: "b-1", workspaceId: "workspace-b" }));

    const leases = await Promise.all([
      queue.claim({ resourceClass: "LLM", workerId: "worker-1", now: 0 }),
      queue.claim({ resourceClass: "LLM", workerId: "worker-2", now: 0 }),
      queue.claim({ resourceClass: "LLM", workerId: "worker-3", now: 0 }),
    ]);

    expect(leases.map((lease) => lease?.workspaceId)).toEqual(["workspace-a", "workspace-a", "workspace-b"]);
  });

  it("uses Retry-After, applies technical backoff, and dead-letters after max attempts", async () => {
    const queue = createInMemoryQueueBackend();
    await queue.enqueue(job({ id: "retry", maxAttempts: 2 }));
    const firstLease = await queue.claim({ resourceClass: "LLM", workerId: "worker", now: 0 });
    const firstFailure = await queue.fail({ leaseId: firstLease!.leaseId, workerId: "worker", technical: true, now: 0 });

    expect(firstFailure).toEqual({ state: "RETRY_SCHEDULED", retried: true, deadLettered: false, retryAt: 2_000 });
    expect(await queue.claim({ resourceClass: "LLM", workerId: "worker", now: 1_999 })).toBeNull();

    const secondLease = await queue.claim({ resourceClass: "LLM", workerId: "worker", now: 2_000 });
    const finalFailure = await queue.fail({ leaseId: secondLease!.leaseId, workerId: "worker", technical: true, retryAfterMs: 20_000, now: 2_000 });
    expect(finalFailure).toEqual({ state: "DEAD_LETTER", retried: false, deadLettered: true });
    expect((await queue.deadLetters({ workspaceId: "workspace-a" })).map((item) => item.id)).toEqual(["retry"]);
  });

  it("keeps semantic failures out of technical retry and exposes the FAILED state", async () => {
    const queue = createInMemoryQueueBackend();
    await queue.enqueue(job({ id: "semantic" }));
    const lease = await queue.claim({ resourceClass: "LLM", workerId: "worker", now: 0 });

    expect(await queue.fail({ leaseId: lease!.leaseId, workerId: "worker", technical: false, now: 0 })).toEqual({ state: "FAILED", retried: false, deadLettered: false });
    expect((await queue.list({ workspaceId: "workspace-a" })).find((item) => item.id === "semantic")?.state).toBe("FAILED");
  });

  it("returns an expired lease to the queue and rejects completion from the old lease", async () => {
    const queue = createInMemoryQueueBackend({ leaseDurationMs: 100 });
    await queue.enqueue(job({ id: "lease" }));
    const firstLease = await queue.claim({ resourceClass: "LLM", workerId: "worker", now: 0 });

    expect(await queue.complete({ leaseId: firstLease!.leaseId, workerId: "worker", now: 101 })).toBe(false);
    const recoveredLease = await queue.claim({ resourceClass: "LLM", workerId: "worker", now: 101 });
    expect(recoveredLease?.id).toBe("lease");
    expect(recoveredLease?.attempt).toBe(2);
  });

  it("moves waiting work out of the worker slot until it is resumed", async () => {
    const queue = createInMemoryQueueBackend();
    await queue.enqueue(job({ id: "waiting" }));
    await queue.enqueue(job({ id: "next" }));
    const lease = await queue.claim({ resourceClass: "LLM", workerId: "worker", now: 0 });

    expect(await queue.wait({ leaseId: lease!.leaseId, workerId: "worker", state: "WAITING_USER", reason: "Falta confirmar o público.", now: 0 })).toBe(true);
    expect((await queue.claim({ resourceClass: "LLM", workerId: "worker-2", now: 0 }))?.id).toBe("next");
    expect(await queue.resume({ jobId: "waiting", workspaceId: "workspace-a", now: 1 })).toBe(true);
    expect((await queue.claim({ resourceClass: "LLM", workerId: "worker-3", now: 1 }))?.id).toBe("waiting");
  });

  it("cancels a run and its descendants without crossing workspaces", async () => {
    const queue = createInMemoryQueueBackend();
    const root = job({ id: "root", runId: "run-root", workspaceId: "workspace-a" });
    await queue.enqueue(root);
    await queue.enqueue(job({ id: "child", runId: "run-child", parentRunId: root.runId, workspaceId: "workspace-a" }));
    await queue.enqueue(job({ id: "grandchild", runId: "run-grandchild", parentRunId: "run-child", workspaceId: "workspace-a" }));
    await queue.enqueue(job({ id: "other", workspaceId: "workspace-b" }));

    expect(await queue.cancelCascade({ rootJobId: root.id, workspaceId: "workspace-a", reason: "takeover humano" })).toBe(3);
    expect((await queue.list({ workspaceId: "workspace-a" })).every((item) => item.state === "CANCELLED")).toBe(true);
    expect(await queue.depth({ resourceClass: "LLM", workspaceId: "workspace-b", now: 0 })).toBe(1);
  });

  it("rejects new work with actionable backpressure and allows explicit dead-letter reprocessing", async () => {
    const queue = createInMemoryQueueBackend({ maxDepth: 1 });
    await queue.enqueue(job({ id: "first", maxAttempts: 1 }));
    await expect(queue.enqueue(job({ id: "second" }))).rejects.toBeInstanceOf(QueueSaturatedError);

    const lease = await queue.claim({ resourceClass: "LLM", workerId: "worker", now: 0 });
    await queue.fail({ leaseId: lease!.leaseId, workerId: "worker", technical: true, now: 0 });
    expect(await queue.reprocess({ jobId: "first", workspaceId: "workspace-a", now: 1 })).toBe(true);
    expect((await queue.list({ workspaceId: "workspace-a" })).find((item) => item.id === "first")?.state).toBe("READY");
  });
});
