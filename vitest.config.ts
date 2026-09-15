import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    passWithNoTests: false,
    exclude: ["node_modules/**", "tests/e2e/**"],
  },
});
