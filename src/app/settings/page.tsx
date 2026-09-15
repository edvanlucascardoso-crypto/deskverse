import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-session";
import { SettingsPage } from "@/components/platform/settings-page";
import { WorkspaceLoading } from "@/components/workspace/workspace-loading";

async function SettingsContent() {
  const session = await getServerSession();
  if (!session) redirect("/login?returnTo=/settings");
  return <SettingsPage />;
}

export default function SettingsRoute() {
  return <Suspense fallback={<WorkspaceLoading />}><SettingsContent /></Suspense>;
}
