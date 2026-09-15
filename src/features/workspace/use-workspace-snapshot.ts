"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { WorkspaceRepository, WorkspaceSnapshot } from "./workspace-domain";

export function useWorkspaceSnapshot(workspaceId: string | null, repository: WorkspaceRepository, initialSnapshot: WorkspaceSnapshot | null = null) {
  const [snapshot, setSnapshot] = useState<WorkspaceSnapshot | null>(initialSnapshot);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!initialSnapshot && Boolean(workspaceId));
  const requestId = useRef(0);

  const refresh = useCallback(async () => {
    const currentRequest = ++requestId.current;
    if (!workspaceId) {
      setSnapshot(null);
      setError(null);
      setLoading(true);
      return;
    }
    setLoading(true);
    setError(null);
    const result = await repository.load(workspaceId);
    if (currentRequest !== requestId.current) return;
    if (result.ok) setSnapshot(result.snapshot);
    else {
      setError(result.message);
      if (result.lastSnapshot) setSnapshot(result.lastSnapshot);
    }
    setLoading(false);
  }, [repository, workspaceId]);

  useEffect(() => {
    if (initialSnapshot?.context.workspaceId === workspaceId) return;
    const timer = window.setTimeout(() => { void refresh(); }, 0);
    return () => window.clearTimeout(timer);
  }, [initialSnapshot, refresh, workspaceId]);
  return { snapshot, error, loading, refresh };
}
