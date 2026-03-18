import { useEffect, useState } from "react";

import { fetchRuns } from "../api/runsApi";
import type { RunSummary } from "../types/runs";

interface UseRunsResult {
  runs: RunSummary[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useRuns(): UseRunsResult {
  const [runs, setRuns] = useState<RunSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);

    try {
      setRuns(await fetchRuns());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load runs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  return {
    runs,
    loading,
    error,
    refresh,
  };
}
