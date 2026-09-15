"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { localOfficeRepository } from "./local-office-repository";
import type { CreateOfficeRunInput, OfficeAction, OfficeWorkspaceState } from "@/types/office";
import { createOfficeSnapshot, reduceOfficeSnapshot } from "./office-domain";

function newLocalRunId() {
  return `office-local-run-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useOfficeStore(workspaceId: string, userId: string) {
  const [officeState, setOfficeState] = useState<OfficeWorkspaceState>({ activeRunId: null, runs: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const snapshot = useMemo(() => officeState.runs.find((run) => run.runId === officeState.activeRunId) ?? null, [officeState]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await localOfficeRepository.load(workspaceId, userId);
    if (result.ok) setOfficeState(result.state);
    else { setError(result.message); if (result.lastState) setOfficeState(result.lastState); }
    setLoading(false);
  }, [userId, workspaceId]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const dispatch = useCallback((action: OfficeAction) => {
    setOfficeState((current) => {
      if (!current.activeRunId) return current;
      return {
        ...current,
        runs: current.runs.map((run) => run.runId === current.activeRunId ? reduceOfficeSnapshot(run, action) : run),
      };
    });
    setError(null);
  }, []);

  const selectRun = useCallback((runId: string) => {
    setOfficeState((current) => current.runs.some((run) => run.runId === runId) ? { ...current, activeRunId: runId } : current);
    setError(null);
  }, []);

  const createRun = useCallback((input: CreateOfficeRunInput) => {
    const run = createOfficeSnapshot(new Date(), newLocalRunId(), input);
    setOfficeState((current) => ({ activeRunId: run.runId, runs: [run, ...current.runs] }));
    setError(null);
  }, []);

  const runScenario = useCallback((actions: OfficeAction[]) => {
    const run = actions.reduce((current, action) => reduceOfficeSnapshot(current, action), createOfficeSnapshot(new Date(), newLocalRunId()));
    setOfficeState((current) => ({ activeRunId: run.runId, runs: [run, ...current.runs] }));
    setError(null);
  }, []);

  useEffect(() => {
    if (!officeState.runs.length) return;
    void localOfficeRepository.save(workspaceId, userId, officeState).catch(() => setError("A alteração apareceu aqui, mas não pôde ser salva neste dispositivo."));
  }, [officeState, userId, workspaceId]);

  return { snapshot, runs: officeState.runs, activeRunId: officeState.activeRunId, loading, error, dispatch, selectRun, createRun, runScenario, retry: load };
}
