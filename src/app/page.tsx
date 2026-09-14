import { redirect } from "next/navigation";
import WorkspacePage from "@/components/workspace/workspace-page";
import { getServerSession } from "@/lib/auth-session";
import { isLocalDemoEnabled } from "@/lib/demo-mode";

export const dynamic = "force-dynamic";

export default async function HomePage({ searchParams }: { searchParams: Promise<{ demo?: string }> }) {
  const [session, params] = await Promise.all([getServerSession(), searchParams]);
  const demoAllowed = isLocalDemoEnabled() && params.demo === "1";
  if (!session && !demoAllowed) redirect("/login?returnTo=/");
  return <WorkspacePage demoMode={demoAllowed} />;
}
