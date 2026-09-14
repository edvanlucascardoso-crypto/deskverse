"use client";

import { useCallback, useEffect, useState } from "react";
import type { WorkspaceRepository, WorkspaceSnapshot } from "./workspace-domain";

export function useWorkspaceSnapshot(workspaceId: string | null, repository: WorkspaceRepository) {
  const [snapshot, setSnapshot] = useState<WorkspaceSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!workspaceId) {
      setSnapshot(null);
      setError(null);
      setLoading(true);
      return;
    }
    setLoading(true);
    setError(null);
    const result = await repository.load(workspaceId);
    if (result.ok) setSnapshot(result.snapshot);
    else {
      setError(result.message);
      if (result.lastSnapshot) setSnapshot(result.lastSnapshot);
    }
    setLoading(false);
  }, [repository, workspaceId]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void refresh(); }, 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);
  return { snapshot, error, loading, refresh };
}
