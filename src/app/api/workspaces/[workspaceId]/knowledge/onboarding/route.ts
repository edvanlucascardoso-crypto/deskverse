import { NextResponse } from "next/server";
import { requireServerUser } from "@/lib/auth-session";
import { saveOnboardingAnswer } from "@/features/knowledge/knowledge-repository";
import { onboardingAnswerSchema } from "@/zod/schemas/knowledge";

export async function POST(request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  const user = await requireServerUser();
  if (!user) return NextResponse.json({ message: "Autenticação necessária." }, { status: 401 });
  const { workspaceId } = await params;
  const body = await request.json().catch(() => null);
  const parsed = onboardingAnswerSchema.safeParse({ ...body, workspaceId });
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Resposta inválida." }, { status: 422 });
  try {
    const result = await saveOnboardingAnswer(workspaceId, user.id, parsed.data.questionId, parsed.data.answer);
    if (!result.ok) return NextResponse.json({ message: "Seu papel não permite alterar o onboarding." }, { status: 403 });
    return NextResponse.json({ onboarding: result.onboarding });
  } catch {
    return NextResponse.json({ message: "Não foi possível salvar esta resposta." }, { status: 503 });
  }
}
