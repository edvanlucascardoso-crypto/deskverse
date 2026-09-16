import "server-only";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { DocumentProcessingStatus, KnowledgeDocument, KnowledgeDocumentVersion } from "@/types/knowledge";

type CreateDocumentInput = {
  workspaceId: string;
  name: string;
  mimeType: string;
  format: string;
  size: number;
  checksum: string;
  origin: string;
  description?: string;
  originalKey: string;
  originalUrl?: string;
};

function versionFromRecord(version: {
  id: string;
  documentId: string;
  version: number;
  checksum: string;
  processingStatus: string;
  extractedText: string | null;
  canonicalMarkdown: string | null;
  derivedCsv: string | null;
  extractionConfidence: number | null;
  conversionTrace: Prisma.JsonValue | null;
  errorCode: string | null;
  errorMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
}): KnowledgeDocumentVersion {
  return {
    id: version.id,
    documentId: version.documentId,
    version: version.version,
    checksum: version.checksum,
    processingStatus: version.processingStatus as DocumentProcessingStatus,
    extractedText: version.extractedText ?? undefined,
    canonicalMarkdown: version.canonicalMarkdown ?? undefined,
    derivedCsv: version.derivedCsv ?? undefined,
    extractionConfidence: version.extractionConfidence ?? undefined,
    conversionTrace: Array.isArray(version.conversionTrace) ? version.conversionTrace as KnowledgeDocumentVersion["conversionTrace"] : [],
    errorCode: version.errorCode ?? undefined,
    errorMessage: version.errorMessage ?? undefined,
    createdAt: version.createdAt.toISOString(),
    updatedAt: version.updatedAt.toISOString(),
  };
}

export async function createDocumentRecord(input: CreateDocumentInput) {
  const existing = await prisma.document.findUnique({ where: { workspaceId_originalKey: { workspaceId: input.workspaceId, originalKey: input.originalKey } }, include: { versions: { orderBy: { version: "desc" }, take: 1 } } });
  if (existing) return { document: existing, version: existing.versions[0] ?? null, deduplicated: true };
  const document = await prisma.document.create({
    data: {
      id: crypto.randomUUID(),
      workspaceId: input.workspaceId,
      name: input.name,
      mimeType: input.mimeType,
      format: input.format,
      size: input.size,
      checksum: input.checksum,
      origin: input.origin,
      description: input.description,
      originalKey: input.originalKey,
      originalUrl: input.originalUrl,
      processingStatus: "UPLOADED",
      versions: { create: { id: crypto.randomUUID(), version: 1, checksum: input.checksum, processingStatus: "UPLOADED" } },
    },
    include: { versions: true },
  });
  return { document, version: document.versions[0] ?? null, deduplicated: false };
}

export async function saveDocumentVersionResult(input: {
  documentId: string;
  versionId: string;
  status: DocumentProcessingStatus;
  extractedText?: string;
  canonicalMarkdown?: string;
  derivedCsv?: string;
  extractionConfidence?: number;
  conversionTrace?: Prisma.InputJsonValue;
  errorCode?: string;
  errorMessage?: string;
}) {
  const version = await prisma.documentVersion.update({
    where: { id: input.versionId },
    data: {
      processingStatus: input.status,
      ...(input.extractedText !== undefined ? { extractedText: input.extractedText } : {}),
      ...(input.canonicalMarkdown !== undefined ? { canonicalMarkdown: input.canonicalMarkdown } : {}),
      ...(input.derivedCsv !== undefined ? { derivedCsv: input.derivedCsv } : {}),
      ...(input.extractionConfidence !== undefined ? { extractionConfidence: input.extractionConfidence } : {}),
      ...(input.conversionTrace !== undefined ? { conversionTrace: input.conversionTrace } : {}),
      ...(input.errorCode !== undefined ? { errorCode: input.errorCode } : {}),
      ...(input.errorMessage !== undefined ? { errorMessage: input.errorMessage } : {}),
    },
  });
  await prisma.document.update({ where: { id: input.documentId }, data: { processingStatus: input.status, processingError: input.errorMessage ?? null } });
  return version;
}

export async function saveDocumentStorageReference(input: { documentId: string; originalKey: string; originalUrl?: string }) {
  return prisma.document.update({ where: { id: input.documentId }, data: { originalKey: input.originalKey, originalUrl: input.originalUrl } });
}

export async function getDocumentStorageReference(input: { workspaceId: string; documentId: string }) {
  return prisma.document.findFirst({ where: { id: input.documentId, workspaceId: input.workspaceId }, select: { id: true, originalKey: true, originalUrl: true } });
}

export async function removeDocumentRecord(input: { workspaceId: string; documentId: string }) {
  return prisma.document.delete({ where: { id: input.documentId, workspaceId: input.workspaceId } });
}

export async function listKnowledgeDocuments(workspaceId: string): Promise<KnowledgeDocument[]> {
  const documents = await prisma.document.findMany({ where: { workspaceId }, include: { versions: { orderBy: { version: "desc" }, take: 1 } }, orderBy: { updatedAt: "desc" } });
  return documents.map((document) => ({
    id: document.id,
    workspaceId: document.workspaceId,
    name: document.name,
    mimeType: document.mimeType,
    format: document.format as KnowledgeDocument["format"],
    size: document.size,
    checksum: document.checksum,
    origin: document.origin,
    description: document.description ?? undefined,
    processingStatus: document.processingStatus as DocumentProcessingStatus,
    processingError: document.processingError ?? undefined,
    createdAt: document.createdAt.toISOString(),
    updatedAt: document.updatedAt.toISOString(),
    currentVersion: document.versions[0] ? versionFromRecord(document.versions[0]) : undefined,
  }));
}
