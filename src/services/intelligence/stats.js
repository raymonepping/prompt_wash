import { scanRepository } from "../repo/scan.js";
import { listExecutionArtifacts, loadAllExecutionArtifacts } from "../execution/storage.js";

function average(values) {
  if (!values.length) {
    return 0;
  }

  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function averagePercent(values) {
  if (!values.length) {
    return 0;
  }

  const result = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Math.round(result);
}

function tokenize(text) {
  if (!text || typeof text !== "string") {
    return 0;
  }

  return text.split(/\s+/).filter(Boolean).length;
}

function summarizeModels(runArtifacts) {
  const counts = new Map();

  for (const artifact of runArtifacts) {
    const model = artifact.execution?.model ?? "unknown";
    counts.set(model, (counts.get(model) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([model, count]) => ({ model, count }))
    .sort((left, right) => right.count - left.count);
}

function summarizeProviders(runArtifacts) {
  const counts = new Map();

  for (const artifact of runArtifacts) {
    const provider = artifact.execution?.provider ?? "unknown";
    counts.set(provider, (counts.get(provider) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([provider, count]) => ({ provider, count }))
    .sort((left, right) => right.count - left.count);
}

function summarizeOptimizedArtifacts(scan) {
  const promptCandidates = scan.prompt_candidates ?? [];

  const optimizedArtifacts = promptCandidates.filter((filePath) =>
    /compact|optimized|optimize/i.test(filePath),
  );

  return {
    count: optimizedArtifacts.length,
    files: optimizedArtifacts,
  };
}

function estimateOptimizationSavings(scan) {
  const candidates = scan.prompt_candidates ?? [];

  const compactFiles = candidates.filter((filePath) => /compact|optimized/i.test(filePath));
  const baselineFiles = candidates.filter((filePath) => !/compact|optimized/i.test(filePath));

  if (compactFiles.length === 0 || baselineFiles.length === 0) {
    return {
      average_saved_percent: 0,
      note: "Not enough optimized prompt artifacts detected yet.",
    };
  }

  return {
    average_saved_percent: null,
    note: "Optimization savings will become exact in a later intelligence step when optimization result artifacts are indexed directly.",
  };
}

export async function buildPromptWashStats() {
  const scan = await scanRepository();
  const runSummaries = await listExecutionArtifacts();
  const runArtifacts = await loadAllExecutionArtifacts();

  const latencyValues = runSummaries
    .map((item) => item.latency_ms)
    .filter((value) => typeof value === "number" && !Number.isNaN(value));

  const renderedPromptTokenValues = runArtifacts
    .map((artifact) => tokenize(artifact.input?.rendered_prompt ?? ""))
    .filter((value) => typeof value === "number" && !Number.isNaN(value));

  const responseTokenValues = runArtifacts
    .map((artifact) => tokenize(artifact.output?.text ?? ""))
    .filter((value) => typeof value === "number" && !Number.isNaN(value));

  const optimizedArtifacts = summarizeOptimizedArtifacts(scan);
  const optimizationEstimate = estimateOptimizationSavings(scan);

  return {
    repository: {
      root: scan.root,
      prompt_candidates: scan.prompt_candidates.length,
      lineage_families: scan.lineage_families.length,
      configured_prompt_folders: scan.project_manifest?.manifest?.prompt_folders ?? [],
      prompt_discovery_mode: scan.prompt_discovery?.strict_prompt_folders
        ? "strict"
        : "fallback_enabled",
    },
    runs: {
      total_runs: runSummaries.length,
      average_latency_ms: average(latencyValues),
      average_rendered_prompt_tokens: average(renderedPromptTokenValues),
      average_response_tokens: average(responseTokenValues),
      providers: summarizeProviders(runArtifacts),
      models: summarizeModels(runArtifacts),
    },
    optimization: {
      optimized_artifact_count: optimizedArtifacts.count,
      optimized_artifact_files: optimizedArtifacts.files,
      average_saved_percent: optimizationEstimate.average_saved_percent,
      note: optimizationEstimate.note,
    },
  };
}