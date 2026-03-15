const GOAL_VERBS = [
  "tell",
  "explain",
  "compare",
  "describe",
  "summarize",
  "analyze",
  "list",
  "outline",
  "show",
  "give",
];

const CONSTRAINT_PATTERNS = [
  /as much detail as possible/i,
  /in as much detail as possible/i,
  /provide me as much detail as possible/i,
  /be as specific as possible/i,
  /be specific/i,
  /step by step/i,
  /keep it short/i,
  /short answer/i,
  /concise/i,
  /avoid jargon/i,
  /include examples?/i,
  /use an analogy/i,
  /with an analogy/i,
];

const TONE_PATTERNS = [
  /brutally honest/i,
  /honest/i,
  /professional/i,
  /casual/i,
  /neutral/i,
  /critical/i,
  /direct/i,
  /opinionated/i,
];

const BIAS_PATTERNS = [
  /favor\s+/i,
  /prefer\s+/i,
  /argue for\s+/i,
  /support\s+/i,
  /be positive about\s+/i,
  /criticize\s+/i,
];

const CONTEXT_PATTERNS = [
  /\bfor a\b/i,
  /\bfor an\b/i,
  /\bin a\b/i,
  /\bwithin a\b/i,
  /\bfor use in\b/i,
  /\bfor a presentation\b/i,
  /\bfor a report\b/i,
  /\bfor a beginner\b/i,
  /\bfor executives?\b/i,
  /\bfor engineers?\b/i,
];

const STEP_LIKE_PATTERNS = [
  /^(explain|describe|compare|list|summarize|analyze|show|include|use|provide)\b/i,
];

export function looksLikeStep(clause) {
  return STEP_LIKE_PATTERNS.some((pattern) => pattern.test(clause));
}

function trimGoalClause(clause) {
  return clause
    .replace(/\bprovide me as much detail as possible\b.*$/i, "")
    .replace(/\bbe as specific as possible\b.*$/i, "")
    .replace(/\bbrutally honest\b.*$/i, "")
    .replace(/\bfavor\b.*$/i, "")
    .trim();
}

function injectSplitMarkers(text) {
  return text
    .replace(/\s+-\s+/g, " | ")
    .replace(/\s*;\s*/g, " | ")
    .replace(/\bbut\b/gi, " | ")
    .replace(/\balso\b/gi, " | ")
    .replace(/\bprovide me\b/gi, " | provide me")
    .replace(/\bbe as\b/gi, " | be as")
    .replace(
      /\bbe\b(?=\s+(specific|concise|brief|detailed|honest|professional|casual|neutral|critical|direct|opinionated))/gi,
      " | be",
    )
    .replace(/\bkeep it\b/gi, " | keep it")
    .replace(/\bfavor\b/gi, " | favor")
    .replace(/\bprefer\b/gi, " | prefer")
    .replace(/\binclude\b/gi, " | include")
    .replace(/\buse\b(?=\s+an analogy)/gi, " | use")
    .replace(/\bbrutally honest\b/gi, " | brutally honest")
    .replace(/\bhonest\b/gi, " | honest")
    .replace(/\bfavor\b/gi, " | favor");    
}

export function segmentPromptIntoClauses(text) {
  if (!text || typeof text !== "string") {
    return [];
  }

  return injectSplitMarkers(text)
    .split(/[|.,\n]/)
    .map((clause) => clause.trim())
    .filter(Boolean);
}

export function classifyClause(clause) {
  const lower = clause.toLowerCase();

  if (GOAL_VERBS.some((verb) => lower.startsWith(verb))) {
    return { type: "goal", value: clause };
  }

  if (BIAS_PATTERNS.some((pattern) => pattern.test(clause))) {
    return { type: "bias", value: clause };
  }

  if (CONSTRAINT_PATTERNS.some((pattern) => pattern.test(clause))) {
    return { type: "constraint", value: clause };
  }

  if (TONE_PATTERNS.some((pattern) => pattern.test(clause))) {
    return { type: "tone", value: clause };
  }

  if (CONTEXT_PATTERNS.some((pattern) => pattern.test(clause))) {
    return { type: "context", value: clause };
  }

  return { type: "unknown", value: clause };
}

export function classifyInstructions(text) {
  const clauses = segmentPromptIntoClauses(text);

  const result = {
    goal: null,
    constraints: [],
    tone: [],
    bias: [],
    context: [],
    unknown: [],
  };

  for (const clause of clauses) {
    const classified = classifyClause(clause);

    if (classified.type === "goal" && !result.goal) {
      result.goal = trimGoalClause(classified.value);
      continue;
    }

    if (classified.type === "constraint") {
      result.constraints.push(classified.value);
      continue;
    }

    if (classified.type === "tone") {
      result.tone.push(classified.value);
      continue;
    }

    if (classified.type === "bias") {
      result.bias.push(classified.value);
      continue;
    }

    if (classified.type === "context") {
      result.context.push(classified.value);
      continue;
    }

    result.unknown.push(classified.value);
  }

  return result;
}
