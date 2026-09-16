import { NextResponse } from "next/server";
import { requireServerUser } from "@/lib/auth-session";
import { getKnowledgeSnapshot } from "@/features/knowledge/knowledge-repository";

export async function GET(_request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  const user = await requireServerUser();
  if (!user) return NextResponse.json({ message: "Autenticação necessária." }, { status: 401 });
  const { workspaceId } = await params;
  try {
    const result = await getKnowledgeSnapshot(workspaceId, user.id);
    if (!result.ok) return NextResponse.json({ message: "Você não pode consultar esta base de conhecimento." }, { status: 403 });
    return NextResponse.json({ snapshot: result.snapshot });
  } catch {
    return NextResponse.json({ message: "Não foi possível carregar a base de conhecimento." }, { status: 503 });
  }
}
