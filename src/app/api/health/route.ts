import { getPlatformHealth } from "@/lib/platform/health";

export async function GET() {
  return Response.json(getPlatformHealth());
}
