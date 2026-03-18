import { useEffect, useState } from "react";

import { fetchExperiments, runExperiment } from "../api/experimentsApi";
import type { RunExperimentData, RunExperimentRequest } from "../types/experiments";

interface UseExperimentsResult {
  experiments: string[];
  loading: boolean;
  running: boolean;
  error: string | null;
  lastRun: RunExperimentData | null;
  refresh: () => Promise<void>;
  execute: (payload: RunExperimentRequest) => Promise<RunExperimentData>;
}

export function useExperiments(): UseExperimentsResult {
  const [experiments, setExperiments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRun, setLastRun] = useState<RunExperimentData | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);

    try {
      setExperiments(await fetchExperiments());
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Failed to load experiments",
      );
    } finally {
      setLoading(false);
    }
  };

  const execute = async (payload: RunExperimentRequest) => {
    setRunning(true);
    setError(null);

    try {
      const result = await runExperiment(payload);
      setLastRun(result);
      return result;
    } catch (runError) {
      const message =
        runError instanceof Error ? runError.message : "Failed to run experiment";
      setError(message);
      throw runError;
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  return {
    experiments,
    loading,
    running,
    error,
    lastRun,
    refresh,
    execute,
  };
}
