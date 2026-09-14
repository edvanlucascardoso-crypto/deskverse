import { describe, expect, it } from "vitest";
import { can, denyReason } from "./rbac";

describe("workspace RBAC", () => {
  it("keeps member administration behind owner/admin roles", () => {
    expect(can("OWNER", "member:manage")).toBe(true);
    expect(can("ADMIN", "member:manage")).toBe(true);
    expect(can("MEMBER", "member:manage")).toBe(false);
    expect(can("VIEWER", "member:manage")).toBe(false);
    expect(denyReason("VIEWER", "member:manage")).toContain("gerenciar pessoas");
  });

  it("does not use agent seniority as a workspace permission", () => {
    expect(can("MEMBER", "activity:write")).toBe(true);
    expect(can("MEMBER", "approval:decide")).toBe(false);
  });
});
