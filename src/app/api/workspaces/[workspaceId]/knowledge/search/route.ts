import { NextResponse } from "next/server";
import { requireServerUser } from "@/lib/auth-session";
import { getWorkspaceAccess } from "@/features/workspace/platform-workspace-repository";
import { can } from "@/lib/permissions/rbac";
import { createDeterministicEmbeddingProvider, createHttpEmbeddingProvider } from "@/features/knowledge/embedding";
import { createPrismaKnowledgeIndex } from "@/features/knowledge/prisma-knowledge-index";
import { knowledgeSearchSchema } from "@/zod/schemas/knowledge";

export async function POST(request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  const user = await requireServerUser();
  if (!user) return NextResponse.json({ message: "Autenticação necessária." }, { status: 401 });
  const { workspaceId } = await params;
  const parsed = knowledgeSearchSchema.safeParse({ ...(await request.json().catch(() => null)), workspaceId });
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Busca inválida." }, { status: 422 });
  const access = await getWorkspaceAccess(workspaceId, user.id);
  if (!access || !can(access.role, "workspace:read")) return NextResponse.json({ message: "Você não pode consultar esta base." }, { status: 403 });
  try {
    const provider = process.env.INFERENCE_GATEWAY_URL ? createHttpEmbeddingProvider() : createDeterministicEmbeddingProvider();
    const embedded = await provider.embed({ text: parsed.data.query, workspaceId: access.workspaceId });
    const result = await createPrismaKnowledgeIndex().search({ workspaceId: access.workspaceId, query: parsed.data.query, limit: parsed.data.limit, queryVector: embedded.vector });
    return NextResponse.json({ result });
  } catch {
    return NextResponse.json({ message: "A busca não conseguiu consultar a base agora." }, { status: 503 });
  }
}
