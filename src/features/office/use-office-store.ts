"use client";

import { useCallback, useEffect, useState } from "react";
import { localOfficeRepository } from "./local-office-repository";
import { createOfficeSnapshot, reduceOfficeSnapshot, type OfficeAction, type OfficeSnapshot } from "./office-domain";

export function useOfficeStore(workspaceId: string, userId: string) {
  const [snapshot, setSnapshot] = useState<OfficeSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await localOfficeRepository.load(workspaceId, userId);
    if (result.ok) setSnapshot(result.snapshot);
    else { setError(result.message); if (result.lastSnapshot) setSnapshot(result.lastSnapshot); }
    setLoading(false);
  }, [userId, workspaceId]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const dispatch = useCallback((action: OfficeAction) => {
    setSnapshot((current) => reduceOfficeSnapshot(current ?? createOfficeSnapshot(), action));
    setError(null);
  }, []);

  useEffect(() => {
    if (!snapshot) return;
    void localOfficeRepository.save(workspaceId, userId, snapshot).catch(() => setError("A atualização ficou visível, mas não pôde ser salva neste dispositivo."));
  }, [snapshot, userId, workspaceId]);

  return { snapshot, loading, error, dispatch, retry: load };
}
