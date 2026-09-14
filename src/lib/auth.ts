import "server-only";

import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "./prisma";

const configuredBaseURL = process.env.BETTER_AUTH_URL;
const configuredSecret = process.env.BETTER_AUTH_SECRET;

if (process.env.NODE_ENV === "production" && (!configuredBaseURL || !configuredSecret)) {
  throw new Error("BETTER_AUTH_URL e BETTER_AUTH_SECRET são obrigatórios em produção.");
}

const baseURL = configuredBaseURL ?? "http://localhost:3000";
const secret = configuredSecret ?? "deskverse-local-development-secret-change-me";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql", transaction: true }),
  baseURL,
  basePath: "/api/auth",
  secret,
  trustedOrigins: [baseURL],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true,
  },
  plugins: [nextCookies()],
});
