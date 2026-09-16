import { NextResponse } from "next/server";
import { requireServerUser } from "@/lib/auth-session";
import { decideConflict } from "@/features/knowledge/knowledge-repository";
import { knowledgeConflictDecisionSchema } from "@/zod/schemas/knowledge";

export async function POST(request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  const user = await requireServerUser();
  if (!user) return NextResponse.json({ message: "Autenticação necessária." }, { status: 401 });
  const { workspaceId } = await params;
  const body = await request.json().catch(() => null);
  const parsed = knowledgeConflictDecisionSchema.safeParse({ ...body, workspaceId });
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Decisão inválida." }, { status: 422 });
  try {
    const result = await decideConflict(workspaceId, user.id, parsed.data.conflictId, parsed.data.status, parsed.data.resolution);
    if (!result.ok) return NextResponse.json({ message: result.reason === "not_found" ? "Conflito não encontrado." : "Seu papel não permite decidir conflitos." }, { status: result.reason === "not_found" ? 404 : 403 });
    return NextResponse.json({ conflict: result.conflict });
  } catch {
    return NextResponse.json({ message: "Não foi possível registrar a decisão." }, { status: 503 });
  }
}
