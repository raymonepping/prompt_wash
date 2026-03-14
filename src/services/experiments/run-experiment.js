import { executePromptObject } from "../execution/execute.js";
import { evaluateRunArtifact } from "../evaluation/evaluate.js";
import { compareRunArtifacts } from "../evaluation/compare-runs.js";

function summarizeVariantResult(variant, execution, evaluation) {
  return {
    variant,
    run_id: execution.artifact.run_id,
    saved_path: execution.saved_path,
    provider: execution.artifact.execution.provider,
    model: execution.artifact.execution.model,
    render_mode: execution.artifact.execution.render_mode,
    latency_ms: execution.artifact.execution.latency_ms,
    fingerprint: execution.artifact.prompt.fingerprint,
    overall_score: evaluation.overall_score,
    overall_level: evaluation.overall_level,
    dimensions: evaluation.dimensions,
    recommendations: evaluation.recommendations,
  };
}

function chooseExperimentWinner(leftSummary, rightSummary) {
  if (leftSummary.overall_score !== rightSummary.overall_score) {
    return leftSummary.overall_score > rightSummary.overall_score
      ? leftSummary.variant
      : rightSummary.variant;
  }

  if (leftSummary.latency_ms !== rightSummary.latency_ms) {
    return leftSummary.latency_ms < rightSummary.latency_ms
      ? leftSummary.variant
      : rightSummary.variant;
  }

  return "tie";
}

export async function runPromptExperiment(promptObject, options = {}) {
  const provider = options.provider ?? "ollama";
  const persistRuns = options.saveRuns ?? false;
  const source = options.source ?? {
    type: "argument",
    path: null,
    lineage: null,
  };

  const variants = options.variants ?? ["generic", "compact"];

  if (!Array.isArray(variants) || variants.length < 2) {
    throw new Error("Experiment requires at least two variants.");
  }

  const executions = [];

  for (const variant of variants) {
    const execution = await executePromptObject(promptObject, {
      provider,
      renderMode: variant,
      persist: persistRuns,
      source,
    });

    const evaluation = evaluateRunArtifact(execution.artifact);

    executions.push({
      variant,
      execution,
      evaluation,
      summary: summarizeVariantResult(variant, execution, evaluation),
    });
  }

  const comparison = compareRunArtifacts(
    executions[0].execution.artifact,
    executions[1].execution.artifact,
  );

  const winner = chooseExperimentWinner(
    executions[0].summary,
    executions[1].summary,
  );

  return {
    provider,
    variants,
    runs: executions.map((item) => item.summary),
    comparison,
    winner,
  };
}
