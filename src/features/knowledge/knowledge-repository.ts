import "server-only";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { can } from "@/lib/permissions/rbac";
import { getWorkspaceAccess } from "@/features/workspace/platform-workspace-repository";
import type { KnowledgeFact, OnboardingState } from "@/types/knowledge";
import { answerOnboardingQuestion, createOnboardingState } from "./onboarding-domain";
import { listKnowledgeDocuments } from "./document-repository";
import { getOrCreateRagIndex } from "./rag-repository";

export async function getKnowledgeSnapshot(workspaceId: string, userId: string) {
  const access = await getWorkspaceAccess(workspaceId, userId);
  if (!access || !can(access.role, "workspace:read")) return { ok: false as const, reason: "forbidden" as const };
  const onboardingRecord = await prisma.onboardingSession.upsert({ where: { workspaceId: access.workspaceId }, update: {}, create: { id: crypto.randomUUID(), workspaceId: access.workspaceId, nextStep: "Responder a primeira pergunta para começar" } });
  const [documents, facts, conflicts, brand, rag] = await Promise.all([
    listKnowledgeDocuments(access.workspaceId),
    prisma.knowledgeFact.findMany({ where: { workspaceId: access.workspaceId }, orderBy: { updatedAt: "desc" } }),
    prisma.knowledgeConflict.findMany({ where: { workspaceId: access.workspaceId }, orderBy: { updatedAt: "desc" } }),
    prisma.brandProfile.findUnique({ where: { workspaceId: access.workspaceId } }),
    getOrCreateRagIndex(access.workspaceId),
  ]);
  const onboarding = createOnboardingState(access.workspaceId, { id: onboardingRecord.id, status: onboardingRecord.status, questionIndex: onboardingRecord.questionIndex, answers: onboardingRecord.answers && typeof onboardingRecord.answers === "object" && !Array.isArray(onboardingRecord.answers) ? onboardingRecord.answers as Record<string, string> : {}, summary: onboardingRecord.summary ?? undefined, nextStep: onboardingRecord.nextStep });
  return { ok: true as const, snapshot: { documents, onboarding, facts, conflicts, brand, rag } };
}

export async function saveOnboardingAnswer(workspaceId: string, userId: string, questionId: string, answer: string) {
  const access = await getWorkspaceAccess(workspaceId, userId);
  if (!access || !can(access.role, "workspace:update")) return { ok: false as const, reason: "forbidden" as const };
  const current = await prisma.onboardingSession.upsert({ where: { workspaceId: access.workspaceId }, update: {}, create: { id: crypto.randomUUID(), workspaceId: access.workspaceId, nextStep: "Responder a primeira pergunta para começar" } });
  const state = createOnboardingState(access.workspaceId, { id: current.id, status: current.status, questionIndex: current.questionIndex, answers: current.answers && typeof current.answers === "object" && !Array.isArray(current.answers) ? current.answers as Record<string, string> : {}, summary: current.summary ?? undefined, nextStep: current.nextStep });
  const next = answerOnboardingQuestion(state, questionId, answer);
  const record = await prisma.onboardingSession.update({ where: { id: current.id }, data: { status: next.status, questionIndex: next.questionIndex, answers: next.answers as Prisma.InputJsonValue, summary: next.summary, nextStep: next.nextStep } });
  await prisma.auditEvent.create({ data: { id: crypto.randomUUID(), workspaceId: access.workspaceId, actorId: userId, action: "knowledge.onboarding.answer", source: "knowledge-drawer", after: { questionId, status: next.status }, nextStep: next.nextStep } });
  return { ok: true as const, onboarding: createOnboardingState(access.workspaceId, { id: record.id, status: record.status, questionIndex: record.questionIndex, answers: next.answers, summary: record.summary ?? undefined, nextStep: record.nextStep }) };
}

export async function decideConflict(workspaceId: string, userId: string, conflictId: string, status: "RESOLVED" | "DISMISSED", resolution?: string) {
  const access = await getWorkspaceAccess(workspaceId, userId);
  if (!access || !can(access.role, "workspace:update")) return { ok: false as const, reason: "forbidden" as const };
  const conflict = await prisma.knowledgeConflict.findFirst({ where: { id: conflictId, workspaceId: access.workspaceId } });
  if (!conflict) return { ok: false as const, reason: "not_found" as const };
  const updated = await prisma.knowledgeConflict.update({ where: { id: conflict.id }, data: { status, resolution: resolution?.trim() || null, resolvedAt: new Date() } });
  await prisma.auditEvent.create({ data: { id: crypto.randomUUID(), workspaceId: access.workspaceId, actorId: userId, action: "knowledge.conflict.decided", source: "knowledge-drawer", before: { status: conflict.status }, after: { status, resolution: resolution?.trim() || null }, nextStep: "Revisar o perfil de trabalho" } });
  return { ok: true as const, conflict: updated };
}

export async function saveBrandProfile(input: { workspaceId: string; userId: string; audience: string; tone: string; rules: string[] }) {
  const access = await getWorkspaceAccess(input.workspaceId, input.userId);
  if (!access || !can(access.role, "workspace:update")) return { ok: false as const, reason: "forbidden" as const };
  const record = await prisma.brandProfile.upsert({ where: { workspaceId: access.workspaceId }, update: { audience: input.audience, tone: input.tone, rules: input.rules as Prisma.InputJsonValue, readiness: "ready" }, create: { id: crypto.randomUUID(), workspaceId: access.workspaceId, audience: input.audience, tone: input.tone, rules: input.rules as Prisma.InputJsonValue, readiness: "ready" } });
  return { ok: true as const, brand: record };
}

export function factsFromSnapshot(value: unknown): KnowledgeFact[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is KnowledgeFact => Boolean(item && typeof item === "object" && "key" in item && "value" in item));
}
