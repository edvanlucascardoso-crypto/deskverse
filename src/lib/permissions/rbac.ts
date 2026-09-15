import type { WorkspacePermission, WorkspaceRole } from "@/types/permissions";

export type { WorkspacePermission, WorkspaceRole } from "@/types/permissions";

const permissionMap: Record<WorkspaceRole, readonly WorkspacePermission[]> = {
  OWNER: ["workspace:read", "workspace:create", "workspace:update", "member:read", "member:manage", "activity:write", "approval:decide"],
  ADMIN: ["workspace:read", "workspace:create", "workspace:update", "member:read", "member:manage", "activity:write", "approval:decide"],
  MEMBER: ["workspace:read", "member:read", "activity:write"],
  VIEWER: ["workspace:read", "member:read"],
};

export function can(role: WorkspaceRole, permission: WorkspacePermission) {
  return permissionMap[role].includes(permission);
}

export function permissionLabel(permission: WorkspacePermission) {
  return permission === "member:manage" ? "gerenciar pessoas" : permission === "workspace:update" ? "alterar o espaço" : permission === "approval:decide" ? "decidir aprovações" : permission === "activity:write" ? "registrar atividade" : "consultar o espaço";
}

export function denyReason(role: WorkspaceRole, permission: WorkspacePermission) {
  return can(role, permission) ? null : `Seu papel não permite ${permissionLabel(permission)}. Peça ajuda a uma pessoa administradora.`;
}
