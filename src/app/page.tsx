import { Suspense } from "react";
import { redirect } from "next/navigation";
import WorkspacePage from "@/components/workspace/workspace-page";
import { WorkspaceLoading } from "@/components/workspace/workspace-loading";
import { getServerWorkspaceBootstrap } from "@/features/workspace/server-workspace-bootstrap";
import { getServerSession } from "@/lib/auth-session";
import { isLocalDemoEnabled } from "@/lib/demo-mode";

async function HomeContent({ searchParams }: { searchParams: Promise<{ demo?: string }> }) {
  const [session, params] = await Promise.all([getServerSession(), searchParams]);
  const demoAllowed = isLocalDemoEnabled() && params.demo === "1";
  if (!session && !demoAllowed) redirect("/login?returnTo=/");
  const bootstrap = session ? await getServerWorkspaceBootstrap(session.user) : null;
  return <WorkspacePage demoMode={demoAllowed} initialWorkspace={bootstrap?.initialWorkspace} initialWorkspaceError={bootstrap?.error} />;
}

export default function HomePage({ searchParams }: { searchParams: Promise<{ demo?: string }> }) {
  return <Suspense fallback={<WorkspaceLoading />}><HomeContent searchParams={searchParams} /></Suspense>;
}
