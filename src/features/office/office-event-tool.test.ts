import { describe, expect, it, vi } from "vitest";

import { createOfficeEventTool } from "./office-event-tool";

describe("office event tool", () => {
  it("validates a detailed approval and does not emit an idempotent retry twice", async () => {
    const sink = vi.fn();
    const tool = createOfficeEventTool({ sink, now: () => new Date("2026-09-15T12:00:00.000Z") });
    const input = {
      runId: "run-1",
      type: "approval.requested",
      source: "Marina Social",
      responsible: "Você",
      message: "O texto está pronto para revisão.",
      impact: "A publicação aguarda sua decisão.",
      nextStep: "Aprovar o texto ou pedir ajustes",
      approvalId: "approval-1",
      idempotencyKey: "approval-1-requested-v1",
      approval: {
        id: "approval-1",
        title: "Texto da campanha",
        summary: "Revise a chamada principal e a legenda.",
        reason: "O texto será usado na publicação de lançamento.",
        requestedBy: "Marina Social",
        artifacts: [{ id: "asset-1", label: "Legenda de lançamento", version: "v1", type: "texto" }],
      },
    };

    const first = await tool.report(input);
    const second = await tool.report(input);

    expect(first.duplicate).toBe(false);
    expect(second.duplicate).toBe(true);
    expect(sink).toHaveBeenCalledTimes(1);
    expect(first.event.occurredAt).toBe("2026-09-15T12:00:00.000Z");
  });

  it("rejects a generic approval without its decision context", async () => {
    const tool = createOfficeEventTool({ sink: vi.fn() });

    await expect(tool.report({
      runId: "run-1",
      type: "approval.requested",
      source: "Marina Social",
      responsible: "Você",
      message: "Aprove a entrega.",
      impact: "O trabalho está pausado.",
      nextStep: "Aprovar",
    })).rejects.toThrow("Uma aprovação detalhada");
  });
});
