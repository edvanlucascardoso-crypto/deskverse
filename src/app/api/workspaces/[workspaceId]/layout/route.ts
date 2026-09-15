import { NextResponse } from "next/server";
import { requireServerUser } from "@/lib/auth-session";
import { saveWorkspacePreference } from "@/features/workspace/platform-workspace-repository";
import { workspacePreferenceInputSchema } from "@/features/workspace/workspace-contracts";

export async function PUT(request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  const user = await requireServerUser();
  if (!user) return NextResponse.json({ message: "Autenticação necessária." }, { status: 401 });
  const parsed = workspacePreferenceInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Dados inválidos." }, { status: 422 });
  const { workspaceId } = await params;
  try {
    const result = await saveWorkspacePreference(workspaceId, user.id, parsed.data);
    if (!result.ok) return NextResponse.json({ message: "Seu papel não permite alterar o layout." }, { status: 403 });
    return NextResponse.json({ preference: result.preference });
  } catch {
    return NextResponse.json({ message: "Não foi possível salvar o layout." }, { status: 503 });
  }
}
