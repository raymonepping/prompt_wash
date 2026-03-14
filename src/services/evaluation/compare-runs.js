import { evaluateRunArtifact } from "./evaluate.js";

function compareLowerIsBetter(left, right) {
  if (left === right) {
    return "tie";
  }

  return left < right ? "left" : "right";
}

function compareHigherIsBetter(left, right) {
  if (left === right) {
    return "tie";
  }

  return left > right ? "left" : "right";
}

function buildRunSummary(runArtifact, evaluation) {
  const renderedPrompt = runArtifact.input?.rendered_prompt ?? "";

  return {
    run_id: runArtifact.run_id,
    provider: runArtifact.execution?.provider ?? null,
    model: runArtifact.execution?.model ?? null,
    render_mode: runArtifact.execution?.render_mode ?? null,
    latency_ms: runArtifact.execution?.latency_ms ?? null,
    rendered_prompt_tokens: renderedPrompt.split(/\s+/).filter(Boolean).length,
    fingerprint: runArtifact.prompt?.fingerprint ?? null,
    intent: runArtifact.prompt?.intent ?? "",
    audience: runArtifact.prompt?.audience ?? "",
    overall_score: evaluation.overall_score,
    overall_level: evaluation.overall_level,
    clarity: evaluation.dimensions.clarity.score,
    structure: evaluation.dimensions.structure.score,
    constraint_adherence: evaluation.dimensions.constraint_adherence.score,
    audience_fit: evaluation.dimensions.audience_fit.score,
  };
}

function buildDeltas(left, right) {
  return {
    latency_ms: (left.latency_ms ?? 0) - (right.latency_ms ?? 0),
    rendered_prompt_tokens:
      (left.rendered_prompt_tokens ?? 0) - (right.rendered_prompt_tokens ?? 0),
    overall_score: (left.overall_score ?? 0) - (right.overall_score ?? 0),
    clarity: (left.clarity ?? 0) - (right.clarity ?? 0),
    structure: (left.structure ?? 0) - (right.structure ?? 0),
    constraint_adherence:
      (left.constraint_adherence ?? 0) - (right.constraint_adherence ?? 0),
    audience_fit: (left.audience_fit ?? 0) - (right.audience_fit ?? 0),
  };
}

function buildWinners(left, right) {
  return {
    latency_ms: compareLowerIsBetter(left.latency_ms ?? 0, right.latency_ms ?? 0),
    rendered_prompt_tokens: compareLowerIsBetter(
      left.rendered_prompt_tokens ?? 0,
      right.rendered_prompt_tokens ?? 0,
    ),
    overall_score: compareHigherIsBetter(
      left.overall_score ?? 0,
      right.overall_score ?? 0,
    ),
    clarity: compareHigherIsBetter(left.clarity ?? 0, right.clarity ?? 0),
    structure: compareHigherIsBetter(left.structure ?? 0, right.structure ?? 0),
    constraint_adherence: compareHigherIsBetter(
      left.constraint_adherence ?? 0,
      right.constraint_adherence ?? 0,
    ),
    audience_fit: compareHigherIsBetter(
      left.audience_fit ?? 0,
      right.audience_fit ?? 0,
    ),
  };
}

function buildRecommendations(left, right, winners) {
  const recommendations = [];

  if (winners.constraint_adherence === "left") {
    recommendations.push(
      `${left.run_id} is stronger on explicit constraint handling.`,
    );
  } else if (winners.constraint_adherence === "right") {
    recommendations.push(
      `${right.run_id} is stronger on explicit constraint handling.`,
    );
  }

  if (winners.overall_score === "left") {
    recommendations.push(`${left.run_id} has the stronger overall evaluation score.`);
  } else if (winners.overall_score === "right") {
    recommendations.push(`${right.run_id} has the stronger overall evaluation score.`);
  }

  if (winners.latency_ms === "left") {
    recommendations.push(`${left.run_id} is faster.`);
  } else if (winners.latency_ms === "right") {
    recommendations.push(`${right.run_id} is faster.`);
  }

  if (recommendations.length === 0) {
    recommendations.push("The two runs are effectively tied on the current comparison dimensions.");
  }

  return recommendations;
}

export function compareRunArtifacts(leftRunArtifact, rightRunArtifact) {
  const leftEvaluation = evaluateRunArtifact(leftRunArtifact);
  const rightEvaluation = evaluateRunArtifact(rightRunArtifact);

  const left = buildRunSummary(leftRunArtifact, leftEvaluation);
  const right = buildRunSummary(rightRunArtifact, rightEvaluation);

  const deltas = buildDeltas(left, right);
  const winners = buildWinners(left, right);
  const recommendations = buildRecommendations(left, right, winners);

  return {
    left,
    right,
    deltas,
    winners,
    recommendations,
  };
}
