import "server-only";

import { headers } from "next/headers";
import { auth } from "./auth";

export async function getServerSession() {
  try {
    return await auth.api.getSession({ headers: await headers() });
  } catch {
    return null;
  }
}

export async function requireServerUser() {
  const session = await getServerSession();
  if (!session?.user) return null;
  return session.user;
}
