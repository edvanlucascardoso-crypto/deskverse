import { NextResponse } from "next/server";
import { requireServerUser } from "@/lib/auth-session";
import { getWorkspaceAccess } from "@/features/workspace/platform-workspace-repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  const user = await requireServerUser();
  if (!user) return NextResponse.json({ message: "Autenticação necessária." }, { status: 401 });
  const { workspaceId } = await params;
  try {
    const access = await getWorkspaceAccess(workspaceId, user.id);
    if (!access) return NextResponse.json({ message: "Workspace não encontrado ou sem acesso." }, { status: 404 });
    return NextResponse.json({ workspace: { id: access.workspace.id, name: access.workspace.name, slug: access.workspace.slug, organizationName: access.workspace.organization.name, memberCount: access.workspace._count.members, role: access.role } });
  } catch {
    return NextResponse.json({ message: "Não foi possível carregar o workspace." }, { status: 503 });
  }
}
