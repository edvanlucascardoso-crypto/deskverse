import "server-only";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { RagIndexState, RagIndexStatus } from "@/types/knowledge";

type RagRecord = {
  id: string;
  workspaceId: string;
  generation: number;
  status: string;
  lastAction: string | null;
  lastError: string | null;
  createdAt: Date;
  updatedAt: Date;
};

function toRagState(record: RagRecord): RagIndexState {
  return {
    id: record.id,
    workspaceId: record.workspaceId,
    generation: record.generation,
    status: record.status as RagIndexStatus,
    lastAction: record.lastAction ?? undefined,
    lastError: record.lastError ?? undefined,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export async function getOrCreateRagIndex(workspaceId: string) {
  const record = await prisma.ragIndex.upsert({
    where: { workspaceId },
    update: {},
    create: { id: crypto.randomUUID(), workspaceId, lastAction: "created" },
  });
  return toRagState(record);
}

export async function beginRagRebuild(input: { workspaceId: string; userId: string }) {
  return prisma.$transaction(async (tx) => {
    const current = await tx.ragIndex.upsert({
      where: { workspaceId: input.workspaceId },
      update: { generation: { increment: 1 }, status: "BUILDING", lastAction: "rebuild", lastError: null },
      create: { id: crypto.randomUUID(), workspaceId: input.workspaceId, generation: 1, status: "BUILDING", lastAction: "rebuild" },
    });
    const removed = await tx.documentChunk.deleteMany({ where: { workspaceId: input.workspaceId } });
    await tx.auditEvent.create({
      data: {
        id: crypto.randomUUID(),
        workspaceId: input.workspaceId,
        actorId: input.userId,
        action: "knowledge.rag.rebuild.started",
        source: "knowledge-rag-control",
        after: { generation: current.generation, status: current.status, removedChunks: removed.count } satisfies Prisma.InputJsonValue,
        nextStep: "Reconstruir o RAG a partir dos documentos prontos",
      },
    });
    return { rag: toRagState(current), removedChunks: removed.count };
  });
}

export async function clearRag(input: { workspaceId: string; userId: string }) {
  return prisma.$transaction(async (tx) => {
    const current = await tx.ragIndex.upsert({
      where: { workspaceId: input.workspaceId },
      update: { generation: { increment: 1 }, status: "EMPTY", lastAction: "delete", lastError: null },
      create: { id: crypto.randomUUID(), workspaceId: input.workspaceId, generation: 1, status: "EMPTY", lastAction: "delete" },
    });
    const removed = await tx.documentChunk.deleteMany({ where: { workspaceId: input.workspaceId } });
    await tx.auditEvent.create({
      data: {
        id: crypto.randomUUID(),
        workspaceId: input.workspaceId,
        actorId: input.userId,
        action: "knowledge.rag.deleted",
        source: "knowledge-rag-control",
        after: { generation: current.generation, status: current.status, removedChunks: removed.count } satisfies Prisma.InputJsonValue,
        nextStep: "Criar um novo RAG quando houver documentos prontos",
      },
    });
    return { rag: toRagState(current), removedChunks: removed.count };
  });
}

export async function beginRagDocumentReplacement(input: { workspaceId: string; userId: string; documentId: string }) {
  return prisma.$transaction(async (tx) => {
    const current = await tx.ragIndex.upsert({
      where: { workspaceId: input.workspaceId },
      update: { status: "BUILDING", lastAction: "document_replace", lastError: null },
      create: { id: crypto.randomUUID(), workspaceId: input.workspaceId, generation: 1, status: "BUILDING", lastAction: "document_replace" },
    });
    const removed = await tx.documentChunk.deleteMany({ where: { workspaceId: input.workspaceId, documentId: input.documentId } });
    await tx.auditEvent.create({
      data: {
        id: crypto.randomUUID(),
        workspaceId: input.workspaceId,
        actorId: input.userId,
        action: "knowledge.rag.document_replace.started",
        source: "knowledge-rag-control",
        after: { generation: current.generation, status: current.status, documentId: input.documentId, removedChunks: removed.count } satisfies Prisma.InputJsonValue,
        nextStep: "Recriar os chunks e embeddings deste arquivo",
      },
    });
    return { rag: toRagState(current), removedChunks: removed.count };
  });
}

export async function markRagReady(input: { workspaceId: string; status: "EMPTY" | "READY"; userId?: string; action?: string }) {
  const record = await prisma.ragIndex.upsert({ where: { workspaceId: input.workspaceId }, update: { status: input.status, lastAction: input.action ?? "ready", lastError: null }, create: { id: crypto.randomUUID(), workspaceId: input.workspaceId, generation: 1, status: input.status, lastAction: input.action ?? "ready" } });
  if (input.userId) await prisma.auditEvent.create({ data: { id: crypto.randomUUID(), workspaceId: input.workspaceId, actorId: input.userId, action: "knowledge.rag.ready", source: "knowledge-rag-control", after: { generation: record.generation, status: record.status } satisfies Prisma.InputJsonValue, nextStep: "Consultar evidências autorizadas" } });
  return toRagState(record);
}

export async function markRagFailed(input: { workspaceId: string; userId: string; message: string; action: string }) {
  const record = await prisma.ragIndex.upsert({ where: { workspaceId: input.workspaceId }, update: { status: "FAILED", lastAction: input.action, lastError: input.message }, create: { id: crypto.randomUUID(), workspaceId: input.workspaceId, generation: 1, status: "FAILED", lastAction: input.action, lastError: input.message } });
  await prisma.auditEvent.create({ data: { id: crypto.randomUUID(), workspaceId: input.workspaceId, actorId: input.userId, action: "knowledge.rag.failed", source: "knowledge-rag-control", after: { generation: record.generation, status: record.status, message: input.message } satisfies Prisma.InputJsonValue, nextStep: "Corrigir a integração e criar o RAG novamente" } });
  return toRagState(record);
}

export async function recordRagOperationFailure(input: { workspaceId: string; userId: string; message: string; action: string }) {
  const record = await prisma.ragIndex.upsert({ where: { workspaceId: input.workspaceId }, update: { status: "FAILED", lastAction: input.action, lastError: input.message }, create: { id: crypto.randomUUID(), workspaceId: input.workspaceId, generation: 1, status: "FAILED", lastAction: input.action, lastError: input.message } });
  await prisma.auditEvent.create({ data: { id: crypto.randomUUID(), workspaceId: input.workspaceId, actorId: input.userId, action: "knowledge.rag.operation_failed", source: "knowledge-rag-control", after: { generation: record.generation, status: record.status, message: input.message } satisfies Prisma.InputJsonValue, nextStep: "Tentar substituir o RAG novamente" } });
  return toRagState(record);
}

export async function deleteDocumentRagChunks(input: { workspaceId: string; documentId: string }) {
  const result = await prisma.documentChunk.deleteMany({ where: { workspaceId: input.workspaceId, documentId: input.documentId } });
  return result.count;
}

export async function deleteRagChunks(workspaceId: string) {
  const result = await prisma.documentChunk.deleteMany({ where: { workspaceId } });
  return result.count;
}

export async function listReadyKnowledgeSources(workspaceId: string) {
  const documents = await prisma.document.findMany({
    where: { workspaceId, processingStatus: "READY" },
    select: {
      id: true,
      name: true,
      versions: {
        where: { processingStatus: "READY", canonicalMarkdown: { not: null } },
        select: { id: true, documentId: true, checksum: true, canonicalMarkdown: true, extractionConfidence: true },
        orderBy: { version: "desc" },
        take: 1,
      },
    },
    orderBy: { id: "asc" },
  });
  return documents.flatMap((document) => {
    const version = document.versions[0];
    return version ? [{ ...version, document: { name: document.name } }] : [];
  });
}

export async function getReadyKnowledgeSource(input: { workspaceId: string; documentId: string }) {
  return prisma.documentVersion.findFirst({
    where: { documentId: input.documentId, document: { workspaceId: input.workspaceId, processingStatus: "READY" }, processingStatus: "READY", canonicalMarkdown: { not: null } },
    select: { id: true, documentId: true, checksum: true, canonicalMarkdown: true, extractionConfidence: true, document: { select: { name: true } } },
    orderBy: { version: "desc" },
  });
}

export type ReadyKnowledgeSource = Awaited<ReturnType<typeof listReadyKnowledgeSources>>[number] & { canonicalMarkdown: string };
