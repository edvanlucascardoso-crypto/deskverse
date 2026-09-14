import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-session";
import { SettingsPage } from "@/components/platform/settings-page";

export const dynamic = "force-dynamic";

export default async function SettingsRoute() {
  const session = await getServerSession();
  if (!session && process.env.NODE_ENV === "production") redirect("/login?returnTo=/settings");
  return <SettingsPage />;
}
