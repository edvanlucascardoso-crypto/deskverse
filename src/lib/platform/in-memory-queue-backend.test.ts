import { describe, expect, it } from "vitest";
import { createInMemoryQueueBackend } from "./in-memory-queue-backend";
import type { QueueJob } from "./contracts";

const job = (overrides: Partial<QueueJob> = {}): QueueJob => ({ id: crypto.randomUUID(), workspaceId: "workspace-a", logicalQueue: "workspace_capability", physicalQueue: "LLM", priority: "NORMAL", payload: {}, maxRetries: 1, ...overrides });

describe("in-memory QueueBackend", () => {
  it("deduplicates an active idempotency key and applies priority", async () => {
    const queue = createInMemoryQueueBackend();
    const first = await queue.enqueue(job({ id: "normal", idempotencyKey: "same" }));
    const duplicate = await queue.enqueue(job({ id: "duplicate", idempotencyKey: "same" }));
    await queue.enqueue(job({ id: "urgent", priority: "URGENT" }));
    expect(first.deduplicated).toBe(false);
    expect(duplicate.deduplicated).toBe(true);
    expect((await queue.claim({ physicalQueue: "LLM", workerId: "worker" }))?.id).toBe("urgent");
  });

  it("retries technical failures and dead-letters semantic failures", async () => {
    const queue = createInMemoryQueueBackend();
    await queue.enqueue(job({ id: "retry", maxRetries: 1 }));
    const lease = await queue.claim({ physicalQueue: "LLM", workerId: "worker" });
    expect(lease).not.toBeNull();
    expect(await queue.fail({ leaseId: lease!.leaseId, workerId: "worker", technical: true })).toEqual({ retried: true, deadLettered: false });
    const retriedLease = await queue.claim({ physicalQueue: "LLM", workerId: "worker" });
    expect(await queue.fail({ leaseId: retriedLease!.leaseId, workerId: "worker", technical: false })).toEqual({ retried: false, deadLettered: true });
    expect((await queue.deadLetters({ workspaceId: "workspace-a" })).map((item) => item.id)).toEqual(["retry"]);
  });

  it("keeps cancellation and depth scoped to the workspace", async () => {
    const queue = createInMemoryQueueBackend();
    await queue.enqueue(job({ id: "root", workspaceId: "workspace-a" }));
    await queue.enqueue(job({ id: "child", workspaceId: "workspace-a", payload: { parentJobId: "root" } }));
    await queue.enqueue(job({ id: "other", workspaceId: "workspace-b" }));
    expect(await queue.cancelCascade({ rootJobId: "root", workspaceId: "workspace-a", reason: "takeover" })).toBe(2);
    expect(await queue.depth({ physicalQueue: "LLM", workspaceId: "workspace-a" })).toBe(0);
    expect(await queue.depth({ physicalQueue: "LLM", workspaceId: "workspace-b" })).toBe(1);
  });
});
