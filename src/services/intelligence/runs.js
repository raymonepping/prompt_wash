import { loadAllExecutionArtifacts } from "../execution/storage.js";
import { evaluateRunArtifact } from "../evaluation/evaluate.js";

function average(values) {
  if (!values.length) {
    return 0;
  }

  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function groupBy(items, selector) {
  const groups = new Map();

  for (const item of items) {
    const key = selector(item);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(item);
  }

  return groups;
}

export async function buildRunIntelligence() {
  const runArtifacts = await loadAllExecutionArtifacts();

  const evaluatedRuns = runArtifacts.map((artifact) => {
    const evaluation = evaluateRunArtifact(artifact);

    return {
      run_id: artifact.run_id,
      provider: artifact.execution?.provider ?? "unknown",
      model: artifact.execution?.model ?? "unknown",
      render_mode: artifact.execution?.render_mode ?? "unknown",
      latency_ms: artifact.execution?.latency_ms ?? 0,
      overall_score: evaluation.overall_score,
      overall_level: evaluation.overall_level,
      intent: artifact.prompt?.intent ?? "",
      fingerprint: artifact.prompt?.fingerprint ?? null,
      created_at: artifact.created_at,
    };
  });

  const models = [...groupBy(evaluatedRuns, (item) => item.model).entries()]
    .map(([model, items]) => ({
      model,
      runs: items.length,
      average_score: average(items.map((item) => item.overall_score)),
      average_latency_ms: average(items.map((item) => item.latency_ms)),
    }))
    .sort((left, right) => right.average_score - left.average_score);

  const providers = [...groupBy(evaluatedRuns, (item) => item.provider).entries()]
    .map(([provider, items]) => ({
      provider,
      runs: items.length,
      average_score: average(items.map((item) => item.overall_score)),
      average_latency_ms: average(items.map((item) => item.latency_ms)),
    }))
    .sort((left, right) => right.average_score - left.average_score);

  const strongestRun = [...evaluatedRuns].sort(
    (left, right) => right.overall_score - left.overall_score,
  )[0] ?? null;

  const fastestRun = [...evaluatedRuns].sort(
    (left, right) => left.latency_ms - right.latency_ms,
  )[0] ?? null;

  return {
    total_runs: evaluatedRuns.length,
    average_score: average(evaluatedRuns.map((item) => item.overall_score)),
    average_latency_ms: average(evaluatedRuns.map((item) => item.latency_ms)),
    strongest_run: strongestRun,
    fastest_run: fastestRun,
    providers,
    models,
    runs: evaluatedRuns,
  };
}