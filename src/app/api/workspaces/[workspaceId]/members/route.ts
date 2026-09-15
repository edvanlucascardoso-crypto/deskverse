import { NextResponse } from "next/server";
import { requireServerUser } from "@/lib/auth-session";
import { addWorkspaceMember, listWorkspaceMembers } from "@/features/workspace/platform-workspace-repository";
import { addWorkspaceMemberInputSchema } from "@/features/workspace/workspace-contracts";

export async function GET(_request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  const user = await requireServerUser();
  if (!user) return NextResponse.json({ message: "Autenticação necessária." }, { status: 401 });
  const { workspaceId } = await params;
  try {
    const result = await listWorkspaceMembers(workspaceId, user.id);
    if (!result.ok) return NextResponse.json({ message: "Você não pode consultar os integrantes deste workspace." }, { status: 403 });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ message: "Não foi possível carregar os integrantes." }, { status: 503 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  const user = await requireServerUser();
  if (!user) return NextResponse.json({ message: "Autenticação necessária." }, { status: 401 });
  const parsed = addWorkspaceMemberInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Dados inválidos." }, { status: 422 });
  const { workspaceId } = await params;
  try {
    const result = await addWorkspaceMember(workspaceId, user.id, { ...parsed.data, email: parsed.data.email.toLowerCase() });
    if (!result.ok && result.reason === "forbidden") return NextResponse.json({ message: "Seu papel não permite gerenciar pessoas." }, { status: 403 });
    if (!result.ok && result.reason === "owner_protected") return NextResponse.json({ message: "O papel de Owner é protegido e não pode ser rebaixado por esta ação." }, { status: 403 });
    if (!result.ok) return NextResponse.json({ message: "Nenhuma conta encontrada com esse e-mail." }, { status: 404 });
    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Não foi possível atualizar os integrantes." }, { status: 503 });
  }
}
