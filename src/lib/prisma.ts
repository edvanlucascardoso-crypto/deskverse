import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { deskversePrisma?: PrismaClient };
const connectionString = process.env.DATABASE_URL ?? process.env.DIRECT_URL ?? "postgresql://deskverse:deskverse@localhost:5432/deskverse";

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.deskversePrisma ?? createPrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.deskversePrisma = prisma;

export const databaseConfigured = Boolean(process.env.DATABASE_URL);
