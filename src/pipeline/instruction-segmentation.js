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
  "write",
  "create",
  "generate",
  "review",
  "refactor",
  "translate",
  "return",
  "what",
  "how",
  "why",
  "when",
  "where",
  "who",
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

const OUTPUT_PATTERNS = [
  /\bjson\b/i,
  /\bmarkdown\b/i,
  /\btable\b/i,
  /\bsummary\b/i,
  /\bbullet(?:ed)? list\b/i,
  /\bbullet points?\b/i,
  /\bbullets?\b/i,
  /\b\d+\s+bullets?\b/i,
  /\b\d+\s+bullet points?\b/i,
  /\bnumbered list\b/i,
  /\blist of \d+\b/i,
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
  /^(explain|describe|compare|list|summarize|analyze|show|include|use|provide|write|create|generate|review|refactor|translate|return|what|how|why|when|where|who)\b/i,
];

export function looksLikeStep(clause) {
  return STEP_LIKE_PATTERNS.some((pattern) => pattern.test(clause));
}

function cleanClause(clause) {
  return clause
    .replace(/\s+/g, " ")
    .replace(/[.,;]+$/g, "")
    .replace(/\b(and|but|also)\s*$/i, "")
    .trim();
}

function trimGoalClause(clause) {
  return cleanClause(
    clause
      .replace(/\bprovide me as much detail as possible\b.*$/i, "")
      .replace(/\bbe as specific as possible\b.*$/i, "")
      .replace(/\bbrutally honest\b.*$/i, "")
      .replace(/\bhonest\b.*$/i, "")
      .replace(/\bfavor\b.*$/i, ""),
  );
}

function injectSplitMarkers(text) {
  return text
    .replace(/\s+-\s+/g, " | ")
    .replace(/\s*;\s*/g, " | ")
    .replace(/\bbut\b/gi, " | ")
    .replace(/\balso\b/gi, " | ")
    .replace(
      /\b(return|give me|give|provide)\b(?=\s+(?:\d+\s+bullets?\b|\d+\s+bullet points?\b|bullets?\b|bullet(?:ed)? list\b|bullet points?\b|numbered list\b|json\b|markdown\b|table\b|summary\b))/gi,
      " | $1",
    )
    .replace(/\bprovide me\b/gi, " | provide me")
    .replace(/\bbe as\b/gi, " | be as")
    .replace(
      /\bbe\b(?=\s+(specific|concise|brief|detailed|professional|casual|neutral|critical|direct|opinionated))/gi,
      " | be",
    )
    .replace(/\bkeep it\b/gi, " | keep it")
    .replace(/\binclude\b/gi, " | include")
    .replace(/\buse\b(?=\s+an analogy)/gi, " | use")
    .replace(/\bbrutally honest\b/gi, " | brutally honest")
    .replace(/\bfavor\b/gi, " | favor")
    .replace(/\bprefer\b/gi, " | prefer");
}

export function segmentPromptIntoClauses(text) {
  if (!text || typeof text !== "string") {
    return [];
  }

  return injectSplitMarkers(text)
    .split(/[|.\n]/)
    .map((clause) => cleanClause(clause))
    .filter(Boolean);
}

export function classifyClause(clause) {
  const lower = clause.toLowerCase();

  if (BIAS_PATTERNS.some((pattern) => pattern.test(clause))) {
    return { type: "bias", value: clause };
  }

  if (OUTPUT_PATTERNS.some((pattern) => pattern.test(clause))) {
    return { type: "output", value: clause };
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

  if (GOAL_VERBS.some((verb) => lower.startsWith(verb))) {
    return { type: "goal", value: clause };
  }

  return { type: "unknown", value: clause };
}

export function classifyInstructions(text) {
  const clauses = segmentPromptIntoClauses(text);

  const result = {
    goal: null,
    additionalGoals: [],
    constraints: [],
    outputInstructions: [],
    tone: [],
    bias: [],
    biasSignals: [],
    context: [],
    unknown: [],
  };

  for (const clause of clauses) {
    const classified = classifyClause(clause);
    const cleaned = cleanClause(classified.value);

    if (/\b(favor|prefer|recommend)\b/i.test(cleaned)) {
      result.biasSignals.push("outcome_steering");
    }

    if (classified.type === "goal") {
      if (!result.goal) {
        result.goal = trimGoalClause(cleaned);
      } else {
        result.additionalGoals.push(cleaned);
      }
      continue;
    }

    if (classified.type === "constraint") {
      result.constraints.push(cleaned);
      continue;
    }

    if (classified.type === "output") {
      result.outputInstructions.push(cleaned);
      continue;
    }

    if (classified.type === "tone") {
      result.tone.push(cleaned);
      continue;
    }

    if (classified.type === "bias") {
      result.bias.push(cleaned);
      continue;
    }

    if (classified.type === "context") {
      result.context.push(cleaned);
      continue;
    }

    result.unknown.push(cleaned);
  }

  result.biasSignals = [...new Set(result.biasSignals)];

  return result;
}
