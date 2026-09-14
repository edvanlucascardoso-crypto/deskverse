"use client";

import { createOfficeSnapshot, type OfficeSnapshot, type OfficeWorkspaceState } from "./office-domain";

export type OfficeLoadResult = { ok: true; state: OfficeWorkspaceState } | { ok: false; message: string; lastState?: OfficeWorkspaceState };
export interface OfficeRepository { load(workspaceId: string, userId: string): Promise<OfficeLoadResult>; save(workspaceId: string, userId: string, state: OfficeWorkspaceState): Promise<void>; }

const keyFor = (workspaceId: string, userId: string) => `deskverse:office:${workspaceId}:${userId}`;

function isOfficeSnapshot(value: unknown): value is OfficeSnapshot {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<OfficeSnapshot>;
  return typeof candidate.runId === "string" && typeof candidate.title === "string" && typeof candidate.state === "string" && Array.isArray(candidate.events);
}

function initialState() {
  const snapshot = createOfficeSnapshot();
  return { activeRunId: snapshot.runId, runs: [snapshot] } satisfies OfficeWorkspaceState;
}

export const localOfficeRepository: OfficeRepository = {
  async load(workspaceId, userId) {
    if (typeof window === "undefined") return { ok: true, state: initialState() };
    const raw = window.localStorage.getItem(keyFor(workspaceId, userId));
    if (!raw) return { ok: true, state: initialState() };
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (isOfficeSnapshot(parsed)) return { ok: true, state: { activeRunId: parsed.runId, runs: [parsed] } };
      if (!parsed || typeof parsed !== "object") return { ok: false, message: "Não conseguimos ler as execuções salvas neste dispositivo." };
      const candidate = parsed as { activeRunId?: unknown; runs?: unknown };
      if (!Array.isArray(candidate.runs) || !candidate.runs.every(isOfficeSnapshot)) return { ok: false, message: "Não conseguimos ler as execuções salvas neste dispositivo." };
      const runs = candidate.runs;
      const activeRunId = typeof candidate.activeRunId === "string" && runs.some((run) => run.runId === candidate.activeRunId) ? candidate.activeRunId : runs[0]?.runId ?? null;
      return { ok: true, state: { activeRunId, runs } };
    } catch {
      return { ok: false, message: "Não conseguimos ler as execuções salvas neste dispositivo." };
    }
  },
  async save(workspaceId, userId, state) {
    if (typeof window !== "undefined") window.localStorage.setItem(keyFor(workspaceId, userId), JSON.stringify(state));
  },
};
