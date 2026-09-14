import "server-only";

import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "./prisma";

const baseURL = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
const secret = process.env.BETTER_AUTH_SECRET ?? "deskverse-local-development-secret-change-me";

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
