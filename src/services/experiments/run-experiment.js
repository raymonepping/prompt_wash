import { executePromptObject } from "../execution/execute.js";
import { evaluateRunArtifact } from "../evaluation/evaluate.js";
import { createExperimentArtifact } from "./schema.js";

function summarizeVariantResult(variant, execution, evaluation) {
  const renderedPrompt = execution.artifact.input?.rendered_prompt ?? "";
  const renderedPromptTokens = renderedPrompt.split(/\s+/).filter(Boolean).length;

  return {
    variant,
    run_id: execution.artifact.run_id,
    saved_path: execution.saved_path,
    provider: execution.artifact.execution.provider,
    model: execution.artifact.execution.model,
    render_mode: execution.artifact.execution.render_mode,
    latency_ms: execution.artifact.execution.latency_ms,
    rendered_prompt_tokens: renderedPromptTokens,
    fingerprint: execution.artifact.prompt.fingerprint,
    overall_score: evaluation.overall_score,
    overall_level: evaluation.overall_level,
    dimensions: evaluation.dimensions,
    recommendations: evaluation.recommendations,
  };
}

function sortByOverall(runs) {
  return [...runs].sort((left, right) => {
    if (right.overall_score !== left.overall_score) {
      return right.overall_score - left.overall_score;
    }

    if (left.latency_ms !== right.latency_ms) {
      return left.latency_ms - right.latency_ms;
    }

    return left.rendered_prompt_tokens - right.rendered_prompt_tokens;
  });
}

function sortByLatency(runs) {
  return [...runs].sort((left, right) => left.latency_ms - right.latency_ms);
}

function sortByPromptTokens(runs) {
  return [...runs].sort(
    (left, right) => left.rendered_prompt_tokens - right.rendered_prompt_tokens,
  );
}

function sortByConstraintAdherence(runs) {
  return [...runs].sort((left, right) => {
    const leftScore = left.dimensions.constraint_adherence.score;
    const rightScore = right.dimensions.constraint_adherence.score;

    if (rightScore !== leftScore) {
      return rightScore - leftScore;
    }

    return left.latency_ms - right.latency_ms;
  });
}

function buildRankings(runSummaries) {
  const bestOverall = sortByOverall(runSummaries)[0] ?? null;
  const fastest = sortByLatency(runSummaries)[0] ?? null;
  const smallestPrompt = sortByPromptTokens(runSummaries)[0] ?? null;
  const bestConstraintAdherence = sortByConstraintAdherence(runSummaries)[0] ?? null;

  return {
    best_overall: bestOverall
      ? {
          variant: bestOverall.variant,
          run_id: bestOverall.run_id,
          overall_score: bestOverall.overall_score,
          latency_ms: bestOverall.latency_ms,
        }
      : null,
    fastest: fastest
      ? {
          variant: fastest.variant,
          run_id: fastest.run_id,
          latency_ms: fastest.latency_ms,
          overall_score: fastest.overall_score,
        }
      : null,
    smallest_prompt: smallestPrompt
      ? {
          variant: smallestPrompt.variant,
          run_id: smallestPrompt.run_id,
          rendered_prompt_tokens: smallestPrompt.rendered_prompt_tokens,
          overall_score: smallestPrompt.overall_score,
        }
      : null,
    best_constraint_adherence: bestConstraintAdherence
      ? {
          variant: bestConstraintAdherence.variant,
          run_id: bestConstraintAdherence.run_id,
          constraint_adherence:
            bestConstraintAdherence.dimensions.constraint_adherence.score,
          overall_score: bestConstraintAdherence.overall_score,
        }
      : null,
  };
}

function buildRecommendations(runSummaries, rankings) {
  const recommendations = [];

  if (rankings.best_overall) {
    recommendations.push(
      `${rankings.best_overall.variant} is the strongest overall variant in this experiment.`,
    );
  }

  if (rankings.fastest) {
    recommendations.push(
      `${rankings.fastest.variant} is the fastest variant.`,
    );
  }

  if (rankings.smallest_prompt) {
    recommendations.push(
      `${rankings.smallest_prompt.variant} uses the smallest rendered prompt.`,
    );
  }

  if (rankings.best_constraint_adherence) {
    recommendations.push(
      `${rankings.best_constraint_adherence.variant} performs best on explicit constraint adherence.`,
    );
  }

  const weakVariants = runSummaries.filter((run) => run.overall_score < 80);
  if (weakVariants.length > 0) {
    recommendations.push(
      `Review lower-performing variants: ${weakVariants.map((item) => item.variant).join(", ")}.`,
    );
  }

  return recommendations;
}

function buildExperimentId() {
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d+Z$/, "")
    .replace("T", "_");

  const suffix = Math.random().toString(16).slice(2, 8);
  return `exp_${timestamp}_${suffix}`;
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

  const runs = executions.map((item) => item.summary);
  const rankings = buildRankings(runs);
  const recommendations = buildRecommendations(runs, rankings);
  const winner = rankings.best_overall?.variant ?? "tie";

  const experimentArtifact = createExperimentArtifact({
    experimentId: buildExperimentId(),
    source,
    provider,
    variants,
    runs,
    rankings,
    recommendations,
    winner,
  });

  return {
    provider,
    variants,
    runs,
    rankings,
    recommendations,
    winner,
    experiment_artifact: experimentArtifact,
  };
}