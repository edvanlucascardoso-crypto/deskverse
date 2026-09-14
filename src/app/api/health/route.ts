import { getPlatformHealth } from "@/lib/platform/health";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(getPlatformHealth());
}
