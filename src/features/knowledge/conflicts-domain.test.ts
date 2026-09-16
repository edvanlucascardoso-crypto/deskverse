import { describe, expect, it } from "vitest";
import { decideKnowledgeConflict, detectKnowledgeConflicts } from "./conflicts-domain";

describe("knowledge conflicts", () => {
  it("detects divergent facts and records a decision", () => {
    const conflicts = detectKnowledgeConflicts([
      { id: "a", workspaceId: "w", key: "tone", value: "próximo", source: "brief", confidence: 0.9, status: "PROPOSED" },
      { id: "b", workspaceId: "w", key: "tone", value: "formal", source: "manual", confidence: 0.8, status: "PROPOSED" },
    ]);
    expect(conflicts).toHaveLength(1);
    expect(decideKnowledgeConflict(conflicts[0], "RESOLVED").status).toBe("RESOLVED");
  });
});
