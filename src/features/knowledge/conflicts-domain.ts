import type { KnowledgeConflict, KnowledgeFact } from "@/types/knowledge";

export function detectKnowledgeConflicts(facts: KnowledgeFact[]): KnowledgeConflict[] {
  const byKey = new Map<string, KnowledgeFact[]>();
  for (const fact of facts) byKey.set(fact.key, [...(byKey.get(fact.key) ?? []), fact]);
  const conflicts: KnowledgeConflict[] = [];
  for (const [factKey, entries] of byKey) {
    const distinct = entries.filter((fact, index, all) => all.findIndex((candidate) => candidate.value === fact.value) === index);
    if (distinct.length < 2) continue;
    const [first, second] = distinct;
    conflicts.push({ id: `conflict-${factKey}`, workspaceId: first.workspaceId, factKey, statementA: first.value, sourceA: first.source, statementB: second.value, sourceB: second.source, status: "OPEN" });
  }
  return conflicts;
}

export function decideKnowledgeConflict(conflict: KnowledgeConflict, decision: "RESOLVED" | "DISMISSED", resolution?: string): KnowledgeConflict {
  return { ...conflict, status: decision, resolution: resolution?.trim() || (decision === "DISMISSED" ? "As fontes foram mantidas para nova revisão." : "Decisão confirmada pela pessoa responsável.") };
}
