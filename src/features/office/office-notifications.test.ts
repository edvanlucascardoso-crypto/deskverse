import { describe, expect, it } from "vitest";
import { createOfficeSnapshot, reduceOfficeSnapshot } from "./office-domain";
import { officeEventToActivity, officeEventToCanvasActivity } from "./office-notifications";

describe("office notifications", () => {
  it("converts a waiting event into a clickable activity", () => {
    const now = new Date("2026-09-14T12:00:00.000Z");
    const started = reduceOfficeSnapshot(createOfficeSnapshot(now), { type: "START" }, now);
    const waiting = reduceOfficeSnapshot(started, { type: "REQUEST_USER" }, now);
    const event = waiting.events[0];
    const activity = officeEventToActivity(event, waiting);

    expect(activity.id).toBe(`office-${event.id}`);
    expect(activity.officeRunId).toBe(waiting.runId);
    expect(activity.text).toContain("público prioritário");
    expect(officeEventToCanvasActivity(event)).toBe("waiting");
  });

  it("marks completed and failed office events on the agent tile", () => {
    const now = new Date("2026-09-14T12:00:00.000Z");
    const started = reduceOfficeSnapshot(createOfficeSnapshot(now), { type: "START" }, now);
    const failed = reduceOfficeSnapshot(started, { type: "FAIL" }, now).events[0];
    const approval = reduceOfficeSnapshot(started, { type: "REQUEST_APPROVAL" }, now);
    const approved = reduceOfficeSnapshot(approval, { type: "APPROVE" }, now);
    const completed = reduceOfficeSnapshot(approved, { type: "COMPLETE" }, now).events[0];

    expect(officeEventToCanvasActivity(failed)).toBe("error");
    expect(officeEventToCanvasActivity(completed)).toBe("completed");
  });

  it("keeps the exact approval linked from the notification to the office drawer", () => {
    const now = new Date("2026-09-14T12:00:00.000Z");
    const started = reduceOfficeSnapshot(createOfficeSnapshot(now), { type: "START" }, now);
    const waiting = reduceOfficeSnapshot(started, { type: "REQUEST_APPROVAL" }, now);
    const event = waiting.events[0];
    const activity = officeEventToActivity(event, waiting);

    expect(event.approvalId).toBe(waiting.approvals[0].id);
    expect(activity.officeApprovalId).toBe(waiting.approvals[0].id);
    expect(activity.officeArtifactId).toBe(waiting.approvals[0].artifacts[0].id);
  });
});
