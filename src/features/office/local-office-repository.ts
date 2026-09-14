"use client";

import { createOfficeSnapshot, type OfficeSnapshot } from "./office-domain";

export type OfficeLoadResult = { ok: true; snapshot: OfficeSnapshot } | { ok: false; message: string; lastSnapshot?: OfficeSnapshot };
export interface OfficeRepository { load(workspaceId: string, userId: string): Promise<OfficeLoadResult>; save(workspaceId: string, userId: string, snapshot: OfficeSnapshot): Promise<void>; }

const keyFor = (workspaceId: string, userId: string) => `deskverse:office:${workspaceId}:${userId}`;

export const localOfficeRepository: OfficeRepository = {
  async load(workspaceId, userId) {
    if (typeof window === "undefined") return { ok: true, snapshot: createOfficeSnapshot() };
    const raw = window.localStorage.getItem(keyFor(workspaceId, userId));
    if (!raw) return { ok: true, snapshot: createOfficeSnapshot() };
    try {
      const snapshot = JSON.parse(raw) as OfficeSnapshot;
      if (!snapshot || !Array.isArray(snapshot.events) || typeof snapshot.state !== "string") return { ok: false, message: "Checkpoint local inválido." };
      return { ok: true, snapshot };
    } catch {
      return { ok: false, message: "Não foi possível ler o checkpoint local." };
    }
  },
  async save(workspaceId, userId, snapshot) {
    if (typeof window !== "undefined") window.localStorage.setItem(keyFor(workspaceId, userId), JSON.stringify(snapshot));
  },
};
