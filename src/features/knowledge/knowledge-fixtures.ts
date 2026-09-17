import type { BrandProfile, KnowledgeChunk, KnowledgeConflict, KnowledgeDocument, KnowledgeFact, OnboardingState, RagIndexState } from "@/types/knowledge";
import { createOnboardingState } from "./onboarding-domain";

export type KnowledgeFixtureState = {
  documents: KnowledgeDocument[];
  chunks: KnowledgeChunk[];
  onboarding: OnboardingState;
  facts: KnowledgeFact[];
  conflicts: KnowledgeConflict[];
  brand: BrandProfile;
  rag: RagIndexState;
};

const timestamp = "2026-09-16T12:00:00.000Z";

export function createKnowledgeFixtures(workspaceId: string): KnowledgeFixtureState {
  const documents: KnowledgeDocument[] = [
    { id: "document-brand-guide", workspaceId, name: "guia-de-marca.pdf", mimeType: "application/pdf", format: "pdf", size: 284_000, checksum: "sha256:brand-guide", origin: "UploadThing", processingStatus: "READY", createdAt: timestamp, updatedAt: timestamp, currentVersion: { id: "brand-guide-v1", documentId: "document-brand-guide", version: 1, checksum: "sha256:brand-guide", processingStatus: "READY", canonicalMarkdown: "# Guia de marca", extractionConfidence: 0.96, conversionTrace: [{ step: "extract", status: "succeeded", provider: "pdf-parse", occurredAt: timestamp }, { step: "normalize", status: "succeeded", provider: "document-normalizer", occurredAt: timestamp }, { step: "embed", status: "succeeded", provider: "InferenceGateway", occurredAt: timestamp }, { step: "index", status: "succeeded", provider: "pgvector", occurredAt: timestamp }], createdAt: timestamp, updatedAt: timestamp } },
    { id: "document-calendar", workspaceId, name: "calendario-editorial.xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", format: "xlsx", size: 96_000, checksum: "sha256:calendar", origin: "UploadThing", processingStatus: "READY", createdAt: timestamp, updatedAt: timestamp, currentVersion: { id: "calendar-v1", documentId: "document-calendar", version: 1, checksum: "sha256:calendar", processingStatus: "READY", derivedCsv: "Tema,Canal\nLançamento,Instagram", canonicalMarkdown: "## Sheet1\n\n| Tema | Canal |\n| --- | --- |\n| Lançamento | Instagram |", extractionConfidence: 0.98, conversionTrace: [{ step: "extract", status: "succeeded", provider: "xlsx", occurredAt: timestamp }, { step: "normalize", status: "succeeded", provider: "spreadsheet-normalizer", occurredAt: timestamp }, { step: "index", status: "succeeded", provider: "pgvector", occurredAt: timestamp }], createdAt: timestamp, updatedAt: timestamp } },
    { id: "document-brief", workspaceId, name: "brief-do-cliente.docx", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", format: "docx", size: 142_000, checksum: "sha256:brief", origin: "UploadThing", processingStatus: "READY", createdAt: timestamp, updatedAt: timestamp, currentVersion: { id: "brief-v1", documentId: "document-brief", version: 1, checksum: "sha256:brief", processingStatus: "READY", canonicalMarkdown: "# Brief do cliente\n\nO tom deve ser claro e próximo.", extractionConfidence: 0.98, conversionTrace: [{ step: "extract", status: "succeeded", provider: "mammoth", occurredAt: timestamp }, { step: "normalize", status: "succeeded", provider: "document-normalizer", occurredAt: timestamp }, { step: "index", status: "succeeded", provider: "pgvector", occurredAt: timestamp }], createdAt: timestamp, updatedAt: timestamp } },
    { id: "document-interview", workspaceId, name: "entrevista-inicial.mp3", mimeType: "audio/mpeg", format: "audio", size: 3_840_000, checksum: "sha256:interview", origin: "UploadThing", processingStatus: "WAITING_USER", processingError: "A transcrição aguarda AI_GATEWAY_API_KEY ou autenticação OIDC da Vercel.", createdAt: timestamp, updatedAt: timestamp, currentVersion: { id: "interview-v1", documentId: "document-interview", version: 1, checksum: "sha256:interview", processingStatus: "WAITING_USER", conversionTrace: [{ step: "transcribe", status: "waiting_user", provider: "Vercel AI Gateway · Whisper", message: "Configure AI_GATEWAY_API_KEY ou autenticação OIDC da Vercel para continuar.", occurredAt: timestamp }], createdAt: timestamp, updatedAt: timestamp } },
  ];
  const chunks: KnowledgeChunk[] = [
    { id: "brand-chunk-0", workspaceId, documentId: "document-brand-guide", documentVersionId: "brand-guide-v1", chunkIndex: 0, titlePath: "Guia de marca > Tom", section: "Tom", startOffset: 0, endOffset: 180, content: "O tom da marca é claro, próximo e direto. Evite promessas sem evidência.", checksum: "sha256:chunk-brand", sourceName: "guia-de-marca.pdf", score: 0.93 },
    { id: "calendar-chunk-0", workspaceId, documentId: "document-calendar", documentVersionId: "calendar-v1", chunkIndex: 0, titlePath: "Calendário > Lançamento", section: "Lançamento", startOffset: 0, endOffset: 160, content: "O lançamento deve sair no Instagram na próxima semana.", checksum: "sha256:chunk-calendar", sourceName: "calendario-editorial.xlsx", score: 0.84 },
    { id: "brief-chunk-0", workspaceId, documentId: "document-brief", documentVersionId: "brief-v1", chunkIndex: 0, titlePath: "Brief do cliente", startOffset: 0, endOffset: 150, content: "O tom deve ser claro e próximo. Não usar linguagem técnica sem explicação.", checksum: "sha256:chunk-brief", sourceName: "brief-do-cliente.docx", score: 0.81 },
  ];
  const onboarding: OnboardingState = createOnboardingState(workspaceId, { status: "COMPLETE", questionIndex: 3, answers: { business: "comunicação de lançamentos", audience: "pequenas empresas", success: "clareza, consistência e entrega no prazo" }, summary: "O workspace trabalha com comunicação de lançamentos. O foco é atender pequenas empresas. Um bom resultado precisa respeitar: clareza, consistência e entrega no prazo.", nextStep: "Revisar o perfil da marca" });
  const facts: KnowledgeFact[] = [
    { id: "fact-audience", workspaceId, key: "audience", value: "pequenas empresas", source: "onboarding", confidence: 0.95, status: "VERIFIED" },
    { id: "fact-tone-a", workspaceId, key: "tone", value: "claro e próximo", source: "brief-do-cliente.docx", confidence: 0.91, status: "PROPOSED" },
    { id: "fact-tone-b", workspaceId, key: "tone", value: "formal e técnico", source: "guia-de-marca.pdf", confidence: 0.62, status: "PROPOSED" },
    { id: "fact-rule", workspaceId, key: "rule", value: "Explicar termos técnicos quando forem indispensáveis.", source: "brief-do-cliente.docx", confidence: 0.9, status: "VERIFIED" },
  ];
  const conflicts: KnowledgeConflict[] = [{ id: "conflict-tone", workspaceId, factKey: "tone", statementA: "claro e próximo", sourceA: "brief-do-cliente.docx", statementB: "formal e técnico", sourceB: "guia-de-marca.pdf", status: "OPEN" }];
  const brand: BrandProfile = { id: `brand-${workspaceId}`, workspaceId, audience: "pequenas empresas", tone: "Revisar conflito entre claro/próximo e formal/técnico", rules: ["Explicar termos técnicos quando forem indispensáveis."], readiness: "incomplete" };
  const rag: RagIndexState = { id: `rag-${workspaceId}`, workspaceId, generation: 1, status: "READY", lastAction: "initial_fixture", createdAt: timestamp, updatedAt: timestamp };
  return { documents, chunks, onboarding, facts, conflicts, brand, rag };
}
