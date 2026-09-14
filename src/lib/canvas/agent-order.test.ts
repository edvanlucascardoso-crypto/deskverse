import { describe, expect, it } from "vitest";
import { mergeAgentOrder, moveAgent } from "./agent-order";

describe("agent order", () => {
  it("merges stale preferences without losing new agents", () => {
    expect(mergeAgentOrder(["manager", "missing"], ["social", "manager", "projects"])).toEqual(["manager", "social", "projects"]);
  });

  it("moves an agent as an insertion and preserves the remaining order", () => {
    expect(moveAgent(["a", "b", "c", "d"], "a", "c")).toEqual(["b", "c", "a", "d"]);
    expect(moveAgent(["a", "b", "c", "d"], "d", "b")).toEqual(["a", "d", "b", "c"]);
  });
});
