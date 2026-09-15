import "server-only";

import type { Prisma } from "@prisma/client";
import { cacheLife, cacheTag, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { can, type WorkspaceRole } from "@/lib/permissions/rbac";
import { parseWorkspaceId } from "@/lib/platform/workspace-scope";
import type { AddWorkspaceMemberInput, CreateWorkspaceInput, WorkspacePreferenceInput, WorkspaceSummary } from "@/types/workspace";

export const workspaceListCacheTag = (userId: string) => `workspace-list:${userId}`;
export const workspaceCacheTag = (workspaceId: string) => `workspace:${workspaceId}`;

const safePart = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 42) || "user";
const slugify = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50) || "workspace";

function defaultOrganizationId(userId: string) {
  return `organization-${safePart(userId)}`;
}

function defaultWorkspaceId(userId: string) {
  return `workspace-${safePart(userId)}`;
}

function summaryFromMember(member: {
  role: WorkspaceRole;
  workspace: {
    id: string;
    name: string;
    slug: string;
    organizationId: string;
    updatedAt: Date;
    organization: { name: string };
    _count: { members: number };
  };
}): WorkspaceSummary {
  return {
    id: member.workspace.id,
    organizationId: member.workspace.organizationId,
    organizationName: member.workspace.organization.name,
    name: member.workspace.name,
    slug: member.workspace.slug,
    role: member.role,
    memberCount: member.workspace._count.members,
    updatedAt: member.workspace.updatedAt.toISOString(),
  };
}

export async function listUserWorkspaces(userId: string) {
  const memberships = await prisma.workspaceMember.findMany({
    where: { userId },
    include: {
      workspace: {
        include: { organization: true, _count: { select: { members: true } } },
      },
    },
    orderBy: { createdAt: "asc" },
  });
  return memberships.map((membership) => summaryFromMember(membership as typeof membership & { role: WorkspaceRole }));
}

export async function listUserWorkspacesCached(userId: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag(workspaceListCacheTag(userId));
  return listUserWorkspaces(userId);
}

export async function ensureDefaultWorkspace(user: { id: string; name: string; email: string }) {
  const organizationId = defaultOrganizationId(user.id);
  const workspaceId = defaultWorkspaceId(user.id);
  await prisma.organization.upsert({
    where: { id: organizationId },
    update: {},
    create: { id: organizationId, name: `${user.name || "Meu"} Workspace`, slug: `org-${safePart(user.id)}` },
  });
  await prisma.workspace.upsert({
    where: { id: workspaceId },
    update: {},
    create: { id: workspaceId, organizationId, name: "Meu workspace", slug: "principal", createdById: user.id },
  });
  await prisma.workspaceMember.upsert({
    where: { workspaceId_userId: { workspaceId, userId: user.id } },
    update: { role: "OWNER" },
    create: { id: crypto.randomUUID(), workspaceId, userId: user.id, role: "OWNER" },
  });
  return workspaceId;
}

export async function createWorkspace(userId: string, input: CreateWorkspaceInput) {
  const organizationId = defaultOrganizationId(userId);
  await prisma.organization.upsert({
    where: { id: organizationId },
    update: {},
    create: { id: organizationId, name: "Minha organização", slug: `org-${safePart(userId)}` },
  });
  const baseSlug = slugify(input.name);
  const workspace = await prisma.$transaction(async (tx) => {
    const created = await tx.workspace.create({
      data: {
        id: crypto.randomUUID(),
        organizationId,
        name: input.name,
        slug: `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`,
        createdById: userId,
      },
    });
    await tx.workspaceMember.create({ data: { id: crypto.randomUUID(), workspaceId: created.id, userId, role: "OWNER" } });
    await tx.auditEvent.create({
      data: {
        id: crypto.randomUUID(),
        workspaceId: created.id,
        actorId: userId,
        action: "workspace.created",
        source: "workspace-settings",
        after: { name: input.name, role: "OWNER" },
        nextStep: "Adicionar integrantes ou conectar um agente",
      },
    });
    return created;
  });
  const access = await getWorkspaceAccess(workspace.id, userId);
  if (!access) throw new Error("Não foi possível confirmar o acesso ao workspace criado.");
  const summary = summaryFromMember(access as typeof access & { role: WorkspaceRole });
  revalidateTag(workspaceListCacheTag(userId), "max");
  revalidateTag(workspaceCacheTag(workspace.id), "max");
  return summary;
}

export async function getWorkspaceAccess(workspaceId: string, userId: string) {
  const parsedWorkspaceId = parseWorkspaceId(workspaceId);
  return prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId: parsedWorkspaceId, userId } },
    include: { workspace: { include: { organization: true, _count: { select: { members: true } } } } },
  });
}

export async function getWorkspaceAccessCached(workspaceId: string, userId: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag(workspaceCacheTag(workspaceId));
  return getWorkspaceAccess(workspaceId, userId);
}

export async function listWorkspaceMembers(workspaceId: string, userId: string) {
  const access = await getWorkspaceAccess(workspaceId, userId);
  if (!access || !can(access.role, "member:read")) return { ok: false as const, reason: "forbidden" as const };
  const members = await prisma.workspaceMember.findMany({
    where: { workspaceId: access.workspaceId },
    include: { user: { select: { id: true, name: true, email: true, image: true } } },
    orderBy: { createdAt: "asc" },
  });
  return {
    ok: true as const,
    members: members.map((member) => ({ id: member.id, userId: member.userId, name: member.user.name, email: member.user.email, image: member.user.image, role: member.role, joinedAt: member.createdAt.toISOString() })),
  };
}

export async function addWorkspaceMember(workspaceId: string, actorId: string, input: AddWorkspaceMemberInput) {
  const access = await getWorkspaceAccess(workspaceId, actorId);
  if (!access || !can(access.role, "member:manage")) return { ok: false as const, reason: "forbidden" as const };
  const user = await prisma.user.findUnique({ where: { email: input.email.toLowerCase() }, select: { id: true, name: true, email: true } });
  if (!user) return { ok: false as const, reason: "user_not_found" as const };
  const existing = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId: access.workspaceId, userId: user.id } },
    select: { role: true },
  });
  if (existing?.role === "OWNER") return { ok: false as const, reason: "owner_protected" as const };
  const member = await prisma.workspaceMember.upsert({
    where: { workspaceId_userId: { workspaceId: access.workspaceId, userId: user.id } },
    update: { role: input.role },
    create: { id: crypto.randomUUID(), workspaceId: access.workspaceId, userId: user.id, role: input.role },
    include: { user: { select: { id: true, name: true, email: true, image: true } } },
  });
  await prisma.auditEvent.create({
    data: {
      id: crypto.randomUUID(),
      workspaceId: access.workspaceId,
      actorId,
      action: "workspace.member.updated",
      source: "workspace-settings",
      before: { userId: user.id, role: existing?.role ?? null },
      after: { userId: user.id, email: user.email, role: input.role },
      nextStep: "A pessoa pode acessar o workspace após autenticar",
    },
  });
  revalidateTag(workspaceListCacheTag(actorId), "max");
  revalidateTag(workspaceListCacheTag(user.id), "max");
  revalidateTag(workspaceCacheTag(access.workspaceId), "max");
  return { ok: true as const, member: { id: member.id, userId: member.userId, name: member.user.name, email: member.user.email, image: member.user.image, role: member.role } };
}

export async function saveWorkspacePreference(workspaceId: string, userId: string, input: WorkspacePreferenceInput) {
  const access = await getWorkspaceAccess(workspaceId, userId);
  if (!access || !can(access.role, "workspace:update")) return { ok: false as const, reason: "forbidden" as const };
  const data = {
    ...(input.theme ? { theme: input.theme } : {}),
    ...(input.view ? { view: input.view } : {}),
    ...(input.selectedItemId !== undefined ? { selectedItemId: input.selectedItemId } : {}),
    ...(input.layout ? { layout: input.layout as Prisma.InputJsonValue } : {}),
  };
  const preference = await prisma.workspacePreference.upsert({
    where: { workspaceId_userId: { workspaceId: access.workspaceId, userId } },
    update: data,
    create: { id: crypto.randomUUID(), workspaceId: access.workspaceId, userId, ...data },
  });
  await prisma.auditEvent.create({
    data: { id: crypto.randomUUID(), workspaceId: access.workspaceId, actorId: userId, action: "workspace.preference.updated", source: "canvas", after: data as Prisma.InputJsonValue, nextStep: "Aplicar a próxima abertura do canvas" },
  });
  revalidateTag(workspaceCacheTag(access.workspaceId), "max");
  return { ok: true as const, preference };
}
