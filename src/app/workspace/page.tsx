import { redirect } from "next/navigation";
import WorkspacePage from "@/components/workspace/workspace-page";
import { getServerSession } from "@/lib/auth-session";
import { isLocalDemoEnabled } from "@/lib/demo-mode";

export const dynamic = "force-dynamic";

export default async function WorkspaceRoute({ searchParams }: { searchParams: Promise<{ demo?: string }> }) {
  const session = await getServerSession();
  const params = await searchParams;
  const demoAllowed = isLocalDemoEnabled() && params.demo === "1";
  if (!session && !demoAllowed) redirect("/login?returnTo=/workspace");
  return <WorkspacePage />;
}
