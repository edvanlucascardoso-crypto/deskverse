import "dotenv/config";
import { defineConfig } from "prisma/config";
import { normalizePostgresConnectionString } from "./src/lib/database-url";

const migrationUrl = normalizePostgresConnectionString(
  process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "postgresql://deskverse:deskverse@localhost:5432/deskverse",
);

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: migrationUrl },
});
