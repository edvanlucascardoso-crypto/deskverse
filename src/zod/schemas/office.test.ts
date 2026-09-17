import { describe, expect, it } from "vitest";
import { createOfficeRunInputSchema, officeAgentEventInputSchema } from "./office";

describe("office schemas", () => {
  it("normalizes a new request and keeps optional context optional", () => {
    const result = createOfficeRunInputSchema.parse({
      title: "  Campanha de primavera  ",
      objective: " Preparar uma publicação para a coleção. ",
      delivery: " Texto e arte revisados ",
    });

    expect(result).toEqual({
      title: "Campanha de primavera",
      objective: "Preparar uma publicação para a coleção.",
      leaderId: "social",
      leaderName: "Marina Social",
      parameters: "",
      delivery: "Texto e arte revisados",
    });
  });

  it("requires the approval details when an agent asks for a decision", () => {
    const result = officeAgentEventInputSchema.safeParse({
      runId: "run-1",
      type: "run.waiting_approval",
      source: "Marina Social",
      responsible: "Você",
      message: "O material está pronto para revisão.",
      impact: "O envio está pausado.",
      nextStep: "Revisar o material",
      approvalId: "approval-1",
    });

    expect(result.success).toBe(false);
  });
});
