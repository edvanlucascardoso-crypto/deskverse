import { z } from "zod";

export const documentMetadataSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do arquivo."),
  mimeType: z.string().trim().min(1, "O tipo do arquivo não foi informado."),
  size: z.number().int().positive("O arquivo precisa ter conteúdo."),
  checksum: z.string().trim().min(8, "O checksum do arquivo não foi informado."),
  description: z.string().trim().max(2_000, "A descrição deve ter até 2.000 caracteres.").optional(),
});

export const knowledgeSearchSchema = z.object({
  workspaceId: z.string().trim().min(1),
  query: z.string().trim().min(2, "Digite uma pergunta ou termo para buscar."),
  limit: z.number().int().min(1).max(12).default(5),
});

export const onboardingAnswerSchema = z.object({
  workspaceId: z.string().trim().min(1),
  questionId: z.string().trim().min(1),
  answer: z.string().trim().min(1, "Escreva uma resposta para continuar.").max(4_000),
});

export const knowledgeConflictDecisionSchema = z.object({
  workspaceId: z.string().trim().min(1),
  conflictId: z.string().trim().min(1),
  status: z.enum(["RESOLVED", "DISMISSED"]),
  resolution: z.string().trim().max(2_000).optional(),
});

export const brandProfileSchema = z.object({
  workspaceId: z.string().trim().min(1),
  audience: z.string().trim().max(2_000),
  tone: z.string().trim().max(2_000),
  rules: z.array(z.string().trim().min(1).max(500)).max(20),
});

export const ragRebuildSchema = z.object({ confirmation: z.literal("APAGAR_E_CRIAR_NOVO_RAG") });
export const ragDeleteSchema = z.object({ confirmation: z.literal("APAGAR_RAG_COMPLETAMENTE") });
export const ragDocumentReplaceSchema = z.object({ confirmation: z.literal("SUBSTITUIR_RAG_DO_ARQUIVO") });
