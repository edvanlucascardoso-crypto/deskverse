import { redirect } from "next/navigation";
import WorkspacePage from "@/app/page";
import { getServerSession } from "@/lib/auth-session";

export const dynamic = "force-dynamic";

export default async function WorkspaceRoute({ searchParams }: { searchParams: Promise<{ demo?: string }> }) {
  const session = await getServerSession();
  const params = await searchParams;
  const demoAllowed = params.demo === "1";
  if (!session && !demoAllowed) redirect("/login?returnTo=/workspace");
  return <WorkspacePage />;
}
