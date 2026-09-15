import { Suspense } from "react";
import { redirect } from "next/navigation";
import WorkspacePage from "@/components/workspace/workspace-page";
import { WorkspaceLoading } from "@/components/workspace/workspace-loading";
import { getServerWorkspaceBootstrap } from "@/features/workspace/server-workspace-bootstrap";
import { getServerSession } from "@/lib/auth-session";
import { isLocalDemoEnabled } from "@/lib/demo-mode";

async function WorkspaceContent({ searchParams }: { searchParams: Promise<{ demo?: string }> }) {
  const session = await getServerSession();
  const params = await searchParams;
  const demoAllowed = isLocalDemoEnabled() && params.demo === "1";
  if (!session && !demoAllowed) redirect("/login?returnTo=/workspace");
  const bootstrap = session ? await getServerWorkspaceBootstrap(session.user) : null;
  return <WorkspacePage demoMode={demoAllowed} initialWorkspace={bootstrap?.initialWorkspace} initialWorkspaceError={bootstrap?.error} />;
}

export default function WorkspaceRoute({ searchParams }: { searchParams: Promise<{ demo?: string }> }) {
  return <Suspense fallback={<WorkspaceLoading />}><WorkspaceContent searchParams={searchParams} /></Suspense>;
}
