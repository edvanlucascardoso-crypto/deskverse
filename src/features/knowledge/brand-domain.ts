import type { BrandProfile, KnowledgeFact, OnboardingState } from "@/types/knowledge";

export function buildBrandProfile(input: { workspaceId: string; onboarding: OnboardingState; facts: KnowledgeFact[] }): BrandProfile {
  const audience = input.onboarding.answers.audience || input.facts.find((fact) => fact.key === "audience")?.value || "Ainda não informado";
  const tone = input.facts.find((fact) => fact.key === "tone")?.value || "Claro, próximo e direto";
  const rules = input.facts.filter((fact) => fact.key === "rule").map((fact) => fact.value);
  const ready = input.onboarding.status === "COMPLETE" && Boolean(audience && tone && rules.length);
  return { id: `brand-${input.workspaceId}`, workspaceId: input.workspaceId, audience, tone, rules, readiness: ready ? "ready" : input.onboarding.status === "COMPLETE" ? "incomplete" : "not_ready" };
}

export function brandReadinessLabel(readiness: BrandProfile["readiness"]) {
  return readiness === "ready" ? "Pronto para uso" : readiness === "incomplete" ? "Falta revisar" : "Ainda não pronto";
}
