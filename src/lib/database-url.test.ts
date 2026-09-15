import { describe, expect, it } from "vitest";

import { normalizePostgresConnectionString } from "./database-url";

describe("normalizePostgresConnectionString", () => {
  it("makes legacy SSL aliases explicit", () => {
    expect(normalizePostgresConnectionString("postgresql://user:pass@host/db?sslmode=require")).toBe(
      "postgresql://user:pass@host/db?sslmode=verify-full",
    );
    expect(normalizePostgresConnectionString("postgresql://user:pass@host/db?sslmode=prefer&pgbouncer=true")).toBe(
      "postgresql://user:pass@host/db?sslmode=verify-full&pgbouncer=true",
    );
  });

  it("preserves explicit and unrelated query parameters", () => {
    const url = "postgresql://user:pass@host/db?sslmode=verify-full&connect_timeout=10";

    expect(normalizePostgresConnectionString(url)).toBe(url);
  });
});
