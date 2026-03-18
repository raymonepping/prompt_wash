import { useEffect, useState } from "react";

import { fetchRunById } from "../api/runsApi";
import type { RunArtifact } from "../types/runs";

interface UseRunResult {
  run: RunArtifact | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useRun(runId: string | null): UseRunResult {
  const [run, setRun] = useState<RunArtifact | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    if (!runId) {
      setRun(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      setRun(await fetchRunById(runId));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load run");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, [runId]);

  return {
    run,
    loading,
    error,
    refresh,
  };
}
