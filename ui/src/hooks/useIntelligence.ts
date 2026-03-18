import { useEffect, useState } from "react";

import { intelligenceApi } from "../api/intelligenceApi";
import type {
  LineageIntelligenceData,
  ModelIntelligenceData,
  OptimizationIntelligenceData,
  RunIntelligenceData,
} from "../types/intelligence";

interface UseIntelligenceResult {
  models: ModelIntelligenceData | null;
  runs: RunIntelligenceData | null;
  optimization: OptimizationIntelligenceData | null;
  lineage: LineageIntelligenceData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useIntelligence(): UseIntelligenceResult {
  const [models, setModels] = useState<ModelIntelligenceData | null>(null);
  const [runs, setRuns] = useState<RunIntelligenceData | null>(null);
  const [optimization, setOptimization] =
    useState<OptimizationIntelligenceData | null>(null);
  const [lineage, setLineage] = useState<LineageIntelligenceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);

    try {
      const [modelData, runData, optimizationData, lineageData] = await Promise.all([
        intelligenceApi.fetchModelIntelligence(),
        intelligenceApi.fetchRunIntelligence(),
        intelligenceApi.fetchOptimizationIntelligence(),
        intelligenceApi.fetchLineageIntelligence(),
      ]);

      setModels(modelData);
      setRuns(runData);
      setOptimization(optimizationData);
      setLineage(lineageData);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Failed to load intelligence",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  return {
    models,
    runs,
    optimization,
    lineage,
    loading,
    error,
    refresh,
  };
}
