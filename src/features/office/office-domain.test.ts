import { describe, expect, it } from "vitest";
import { createOfficeSnapshot, reduceOfficeSnapshot } from "./office-domain";

const now = new Date("2026-09-14T12:00:00.000Z");

describe("office flow state machine", () => {
  it("persists a user checkpoint and resumes from WAITING_USER", () => {
    const started = reduceOfficeSnapshot(createOfficeSnapshot(now), { type: "START" }, now);
    const waiting = reduceOfficeSnapshot(started, { type: "REQUEST_USER" }, now);
    const resumed = reduceOfficeSnapshot(waiting, { type: "ANSWER_USER", answer: "Leads quentes" }, now);
    expect(waiting.state).toBe("WAITING_USER");
    expect(waiting.checkpoint).toBe("audience-choice");
    expect(resumed.state).toBe("working");
    expect(resumed.checkpoint).toBe("Leads quentes");
    expect(resumed.events).toHaveLength(3);
  });

  it("requires a human approval before delivery and preserves recovery", () => {
    const started = reduceOfficeSnapshot(createOfficeSnapshot(now), { type: "START" }, now);
    const blocked = reduceOfficeSnapshot(started, { type: "COMPLETE" }, now);
    const approval = reduceOfficeSnapshot(started, { type: "REQUEST_APPROVAL" }, now);
    const rejected = reduceOfficeSnapshot(approval, { type: "REJECT" }, now);
    const retry = reduceOfficeSnapshot(rejected, { type: "RETRY" }, now);
    const renewedApproval = reduceOfficeSnapshot(retry, { type: "REQUEST_APPROVAL" }, now);
    const approved = reduceOfficeSnapshot(renewedApproval, { type: "APPROVE" }, now);
    const completed = reduceOfficeSnapshot(approved, { type: "COMPLETE" }, now);
    expect(approval.state).toBe("WAITING_APPROVAL");
    expect(blocked).toBe(started);
    expect(rejected.delivery.status).toBe("pending");
    expect(retry.state).toBe("working");
    expect(completed.state).toBe("success");
    expect(completed.delivery.status).toBe("ready");
  });

  it("keeps multiple approvals independent until all required items are decided", () => {
    const started = reduceOfficeSnapshot(createOfficeSnapshot(now), { type: "START" }, now);
    const waiting = reduceOfficeSnapshot(started, { type: "REQUEST_APPROVAL" }, now);
    const firstApproval = waiting.approvals[0];
    const secondApproval = { ...firstApproval, id: `${waiting.runId}-approval-2`, title: "Arte da publicação", order: 1, artifacts: [{ id: "asset-2", label: "Arte da publicação", version: "v1", type: "imagem" }] };
    const withTwoApprovals = { ...waiting, approvals: [...waiting.approvals, secondApproval] };
    const afterFirstDecision = reduceOfficeSnapshot(withTwoApprovals, { type: "APPROVE", approvalId: firstApproval.id }, now);
    const afterSecondDecision = reduceOfficeSnapshot(afterFirstDecision, { type: "APPROVE", approvalId: secondApproval.id }, now);

    expect(afterFirstDecision.state).toBe("WAITING_APPROVAL");
    expect(afterFirstDecision.approvals.find((approval) => approval.id === firstApproval.id)?.state).toBe("approved");
    expect(afterFirstDecision.approvals.find((approval) => approval.id === secondApproval.id)?.state).toBe("pending");
    expect(afterSecondDecision.state).toBe("working");
    expect(afterSecondDecision.checkpoint).toBe("approval-approved");
  });
});
