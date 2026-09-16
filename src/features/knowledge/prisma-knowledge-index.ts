import "server-only";

import { prisma } from "@/lib/prisma";
import type { KnowledgeChunk } from "@/types/knowledge";
import type { KnowledgeIndex } from "./knowledge-retrieval";

type StoredChunkRow = {
  id: string;
  workspaceId: string;
  documentId: string;
  documentVersionId: string;
  chunkIndex: number;
  titlePath: string;
  pageStart: number | null;
  pageEnd: number | null;
  section: string | null;
  startOffset: number;
  endOffset: number;
  content: string;
  checksum: string;
  extractionConfidence: number | null;
  permissions: Record<string, unknown> | null;
  sourceName: string;
  score: number;
};

function vectorLiteral(vector: number[]) {
  if (!vector.length || vector.some((value) => !Number.isFinite(value))) throw new Error("Embedding inválido.");
  return `[${vector.join(",")}]`;
}

export function createPrismaKnowledgeIndex(): KnowledgeIndex {
  return {
    async index({ chunks, vectors }) {
      await prisma.$transaction(async (tx) => {
        const documentIds = [...new Set(chunks.map((chunk) => chunk.documentId))];
        for (const documentId of documentIds) await tx.$executeRaw`UPDATE "DocumentChunk" SET "isActive" = false WHERE "documentId" = ${documentId}`;
        for (let index = 0; index < chunks.length; index += 1) {
          const chunk = chunks[index];
          await tx.$executeRaw`
            INSERT INTO "DocumentChunk" ("id", "workspaceId", "documentId", "documentVersionId", "chunkIndex", "titlePath", "pageStart", "pageEnd", "section", "startOffset", "endOffset", "content", "checksum", "extractionConfidence", "permissions", "embedding", "isActive", "createdAt")
            VALUES (${chunk.id}, ${chunk.workspaceId}, ${chunk.documentId}, ${chunk.documentVersionId}, ${chunk.chunkIndex}, ${chunk.titlePath}, ${chunk.pageStart ?? null}, ${chunk.pageEnd ?? null}, ${chunk.section ?? null}, ${chunk.startOffset}, ${chunk.endOffset}, ${chunk.content}, ${chunk.checksum}, ${chunk.extractionConfidence ?? null}, ${JSON.stringify(chunk.permissions ?? null)}::jsonb, CAST(${vectorLiteral(vectors[index])} AS vector), true, CURRENT_TIMESTAMP)
            ON CONFLICT ("documentVersionId", "chunkIndex") DO UPDATE SET "content" = EXCLUDED."content", "checksum" = EXCLUDED."checksum", "embedding" = EXCLUDED."embedding", "isActive" = true, "permissions" = EXCLUDED."permissions";
          `;
        }
      });
    },
    async search(input) {
      const limit = input.limit ?? 5;
      const queryVectorLiteral = input.queryVector ? vectorLiteral(input.queryVector) : null;
      const rows = queryVectorLiteral
        ? await prisma.$queryRaw<StoredChunkRow[]>`
            SELECT c."id", c."workspaceId", c."documentId", c."documentVersionId", c."chunkIndex", c."titlePath", c."pageStart", c."pageEnd", c."section", c."startOffset", c."endOffset", c."content", c."checksum", c."extractionConfidence", c."permissions", d."name" AS "sourceName",
              (0.55 * CASE WHEN c."content" ILIKE ${`%${input.query}%`} THEN 1 ELSE 0 END + 0.45 * (1 - (c."embedding" <=> CAST(${queryVectorLiteral} AS vector)))) AS "score"
            FROM "DocumentChunk" c
            JOIN "Document" d ON d."id" = c."documentId"
            JOIN "RagIndex" r ON r."workspaceId" = c."workspaceId" AND r."status" = 'READY'
            WHERE c."workspaceId" = ${input.workspaceId} AND c."isActive" = true
              AND (c."permissions" IS NULL OR c."permissions" @> ${JSON.stringify({ allowedWorkspaceIds: [input.workspaceId] })}::jsonb)
            ORDER BY "score" DESC
            LIMIT ${limit};
          `
        : await prisma.$queryRaw<StoredChunkRow[]>`
            SELECT c."id", c."workspaceId", c."documentId", c."documentVersionId", c."chunkIndex", c."titlePath", c."pageStart", c."pageEnd", c."section", c."startOffset", c."endOffset", c."content", c."checksum", c."extractionConfidence", c."permissions", d."name" AS "sourceName",
              CASE WHEN c."content" ILIKE ${`%${input.query}%`} THEN 1 ELSE 0 END AS "score"
            FROM "DocumentChunk" c
            JOIN "Document" d ON d."id" = c."documentId"
            JOIN "RagIndex" r ON r."workspaceId" = c."workspaceId" AND r."status" = 'READY'
            WHERE c."workspaceId" = ${input.workspaceId} AND c."isActive" = true
              AND (c."permissions" IS NULL OR c."permissions" @> ${JSON.stringify({ allowedWorkspaceIds: [input.workspaceId] })}::jsonb)
            ORDER BY "score" DESC
            LIMIT ${limit};
          `;
      const chunks: KnowledgeChunk[] = rows.filter((row) => row.score > 0).map((row) => ({ ...row, pageStart: row.pageStart ?? undefined, pageEnd: row.pageEnd ?? undefined, section: row.section ?? undefined, extractionConfidence: row.extractionConfidence ?? undefined, permissions: row.permissions ?? undefined, score: Number(row.score), sourceName: row.sourceName }));
      return { query: input.query, evidence: chunks.length ? "FOUND" : "INSUFFICIENT", chunks, answerContext: chunks.length ? chunks.map((chunk) => `[${chunk.sourceName || "Documento"} · ${chunk.titlePath}]\n${chunk.content}`).join("\n\n") : "Não há evidência suficiente na base autorizada." };
    },
  };
}
