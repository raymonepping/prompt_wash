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

function buildEvaluatedRuns(runArtifacts) {
  return runArtifacts.map((artifact) => {
    const evaluation = evaluateRunArtifact(artifact);

    return {
      run_id: artifact.run_id,
      provider: artifact.execution?.provider ?? "unknown",
      model: artifact.execution?.model ?? "unknown",
      render_mode: artifact.execution?.render_mode ?? "unknown",
      latency_ms: artifact.execution?.latency_ms ?? 0,
      overall_score: evaluation.overall_score,
      overall_level: evaluation.overall_level,
      clarity: evaluation.dimensions.clarity.score,
      structure: evaluation.dimensions.structure.score,
      constraint_adherence: evaluation.dimensions.constraint_adherence.score,
      audience_fit: evaluation.dimensions.audience_fit.score,
      intent: artifact.prompt?.intent ?? "",
      fingerprint: artifact.prompt?.fingerprint ?? null,
      created_at: artifact.created_at,
    };
  });
}

function summarizeModel(model, runs) {
  const sortedByScore = [...runs].sort((left, right) => {
    if (right.overall_score !== left.overall_score) {
      return right.overall_score - left.overall_score;
    }

    return left.latency_ms - right.latency_ms;
  });

  const bestRun = sortedByScore[0] ?? null;

  return {
    model,
    provider: bestRun?.provider ?? "unknown",
    runs: runs.length,
    average_score: average(runs.map((item) => item.overall_score)),
    average_latency_ms: average(runs.map((item) => item.latency_ms)),
    average_clarity: average(runs.map((item) => item.clarity)),
    average_structure: average(runs.map((item) => item.structure)),
    average_constraint_adherence: average(
      runs.map((item) => item.constraint_adherence),
    ),
    average_audience_fit: average(runs.map((item) => item.audience_fit)),
    best_run: bestRun
      ? {
          run_id: bestRun.run_id,
          overall_score: bestRun.overall_score,
          overall_level: bestRun.overall_level,
          latency_ms: bestRun.latency_ms,
          intent: bestRun.intent,
        }
      : null,
  };
}

function summarizeProvider(provider, runs) {
  return {
    provider,
    runs: runs.length,
    models: [...new Set(runs.map((item) => item.model))].sort(),
    average_score: average(runs.map((item) => item.overall_score)),
    average_latency_ms: average(runs.map((item) => item.latency_ms)),
  };
}

export async function buildModelIntelligence() {
  const runArtifacts = await loadAllExecutionArtifacts();
  const evaluatedRuns = buildEvaluatedRuns(runArtifacts);

  const modelGroups = groupBy(evaluatedRuns, (item) => item.model);
  const providerGroups = groupBy(evaluatedRuns, (item) => item.provider);

  const models = [...modelGroups.entries()]
    .map(([model, runs]) => summarizeModel(model, runs))
    .sort((left, right) => {
      if (right.average_score !== left.average_score) {
        return right.average_score - left.average_score;
      }

      return left.average_latency_ms - right.average_latency_ms;
    });

  const providers = [...providerGroups.entries()]
    .map(([provider, runs]) => summarizeProvider(provider, runs))
    .sort((left, right) => {
      if (right.average_score !== left.average_score) {
        return right.average_score - left.average_score;
      }

      return left.average_latency_ms - right.average_latency_ms;
    });

  const bestModel = models[0] ?? null;
  const fastestModel = [...models].sort(
    (left, right) => left.average_latency_ms - right.average_latency_ms,
  )[0] ?? null;

  return {
    total_runs: evaluatedRuns.length,
    total_models: models.length,
    total_providers: providers.length,
    best_model: bestModel
      ? {
          model: bestModel.model,
          average_score: bestModel.average_score,
          average_latency_ms: bestModel.average_latency_ms,
        }
      : null,
    fastest_model: fastestModel
      ? {
          model: fastestModel.model,
          average_score: fastestModel.average_score,
          average_latency_ms: fastestModel.average_latency_ms,
        }
      : null,
    providers,
    models,
  };
}