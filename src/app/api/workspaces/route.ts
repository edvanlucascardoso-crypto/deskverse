import { NextResponse } from "next/server";
import { requireServerUser } from "@/lib/auth-session";
import { ensureDefaultWorkspace, createWorkspace, listUserWorkspacesCached } from "@/features/workspace/platform-workspace-repository";
import { createWorkspaceInputSchema } from "@/zod/schemas/workspace";

export async function GET() {
  const user = await requireServerUser();
  if (!user) return NextResponse.json({ message: "Autenticação necessária." }, { status: 401 });
  try {
    await ensureDefaultWorkspace(user);
    return NextResponse.json({ workspaces: await listUserWorkspacesCached(user.id) });
  } catch {
    return NextResponse.json({ message: "Não foi possível carregar os workspaces agora." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const user = await requireServerUser();
  if (!user) return NextResponse.json({ message: "Autenticação necessária." }, { status: 401 });
  const parsed = createWorkspaceInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Dados inválidos." }, { status: 422 });
  try {
    const workspace = await createWorkspace(user.id, parsed.data);
    return NextResponse.json({ workspace }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Não foi possível criar o workspace." }, { status: 503 });
  }
}
