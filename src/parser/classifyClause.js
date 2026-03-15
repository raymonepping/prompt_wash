const GOAL_VERBS = [
  "tell",
  "explain",
  "compare",
  "describe",
  "summarize",
  "analyze",
  "list",
  "outline",
];

const CONSTRAINT_PATTERNS = [
  /detail/i,
  /specific/i,
  /step by step/i,
  /short/i,
  /concise/i,
];

const TONE_PATTERNS = [
  /honest/i,
  /professional/i,
  /casual/i,
  /neutral/i,
  /critical/i,
];

const BIAS_PATTERNS = [/favor/i, /prefer/i, /argue for/i, /support/i];

export function classifyClause(clause) {
  const lower = clause.toLowerCase();

  for (const verb of GOAL_VERBS) {
    if (lower.startsWith(verb)) {
      return { type: "goal", value: clause };
    }
  }

  for (const r of BIAS_PATTERNS) {
    if (r.test(lower)) {
      return { type: "bias", value: clause };
    }
  }

  for (const r of CONSTRAINT_PATTERNS) {
    if (r.test(lower)) {
      return { type: "constraint", value: clause };
    }
  }

  for (const r of TONE_PATTERNS) {
    if (r.test(lower)) {
      return { type: "tone", value: clause };
    }
  }

  return { type: "context", value: clause };
}
