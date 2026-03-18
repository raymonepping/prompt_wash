const GOAL_VERBS = [
  "tell",
  "teach",
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
  /use language that a ceo understands/i,
  /use language a ceo understands/i,
  /from an engineer perspective/i,
  /for an engineer perspective/i,
  /for executives?/i,
  /for leadership/i,
];

const AUDIENCE_PATTERNS = [
  /\bengineer perspective\b/i,
  /\bdeveloper perspective\b/i,
  /\bfor engineers?\b/i,
  /\bfor developers?\b/i,
  /\bceo understands\b/i,
  /\bexecutive language\b/i,
  /\bcxo\b/i,
  /\bfor executives?\b/i,
  /\bleadership\b/i,
];

const COMPARISON_PATTERNS = [
  /\bdifferences?\b.*\bvault\b.*\bopenbao\b/i,
  /\bcompare\b.*\bvault\b.*\bopenbao\b/i,
  /\bwhy vault is better\b/i,
  /\bwhy vault is stronger\b/i,
  /\bvault is better\b/i,
  /\bvault is stronger\b/i,
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
  /brutal truth/i,
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
  /\bfor use in\b/i,
  /\bfor a presentation\b/i,
  /\bfor a report\b/i,
  /\bin the context of\b/i,
  /\bwithin the context of\b/i,
];

const ROLE_PATTERNS = [/^you are\b/i, /^act as\b/i];

const DESIRE_PATTERNS = [
  /^i want to know\b/i,
  /^i want\b/i,
  /^i need to know\b/i,
];

const STEP_LIKE_PATTERNS = [
  /^(teach|explain|describe|compare|list|summarize|analyze|show|include|use|provide|write|create|generate|review|refactor|translate|return|what|how|why|when|where|who)\b/i,
];

export function looksLikeStep(clause) {
  return STEP_LIKE_PATTERNS.some((pattern) => pattern.test(clause));
}

function normalizeToneClause(clause) {
  const lower = clause.toLowerCase();

  if (lower.includes("brutal truth") || lower.includes("brutally honest")) {
    return "brutally honest";
  }

  return clause;
}

function cleanClause(clause) {
  return clause
    .replace(/\s+/g, " ")
    .replace(/[.,;]+$/g, "")
    .replace(/\b(and|but|also)\s*$/i, "")
    .trim();
}

function normalizeComparisonClause(clause) {
  const lower = clause.toLowerCase();

  if (
    lower.includes("differences") &&
    lower.includes("vault") &&
    lower.includes("openbao")
  ) {
    return "Tell me the differences between hashicorp vault and openbao";
  }

  if (lower.includes("why vault is better")) {
    return "Explain why Vault is considered better";
  }

  if (lower.includes("why vault is stronger")) {
    return "Explain why Vault is considered stronger";
  }

  return clause;
}

function trimGoalClause(clause) {
  return cleanClause(
    clause
      .replace(/^i want to know\b\s*/i, "")
      .replace(/^i need to know\b\s*/i, "")
      .replace(/\bprovide me as much detail as possible\b.*$/i, "")
      .replace(/\bbe as specific as possible\b.*$/i, "")
      .replace(/\bgive me the brutal truth\b.*$/i, "")
      .replace(/\bbrutal truth\b.*$/i, "")
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
    .replace(/\bprefer\b/gi, " | prefer")
    .replace(/\breturn a list of bullets\b/gi, " | return a list of bullets")
    .replace(/\breturn a bullet list\b/gi, " | return a bullet list")
    .replace(/\breturn a list\b(?=\s+of\s+bullets?\b)/gi, " | return a list")
    .replace(/\bon why\b/gi, " | on why")
    .replace(/\bdo this from\b/gi, " | do this from")
    .replace(/\buse language that\b/gi, " | use language that")
    .replace(/\bwhy vault is better\b/gi, " | why vault is better")
    .replace(/\bwhy vault is stronger\b/gi, " | why vault is stronger")
    .replace(/\bvault is better\b/gi, " | vault is better")
    .replace(/\bvault is stronger\b/gi, " | vault is stronger");
}

function normalizeStepClause(clause) {
  const lower = clause.toLowerCase();

  if (lower.includes("why vault is better")) {
    return "Explain why Vault is considered better";
  }

  if (lower.includes("why vault is stronger")) {
    return "Explain why Vault is considered stronger";
  }

  if (
    lower.includes("differences") &&
    lower.includes("vault") &&
    lower.includes("openbao")
  ) {
    return "Explain the differences between Vault and OpenBao";
  }

  if (lower.includes("engineer perspective")) {
    return "Frame the explanation from an engineer perspective";
  }

  if (lower.includes("ceo understands")) {
    return "Make the explanation understandable for executive readers";
  }

  return clause;
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

  if (ROLE_PATTERNS.some((pattern) => pattern.test(clause))) {
    return { type: "context", value: clause };
  }

  if (BIAS_PATTERNS.some((pattern) => pattern.test(clause))) {
    return { type: "bias", value: clause };
  }

  if (AUDIENCE_PATTERNS.some((pattern) => pattern.test(clause))) {
    return { type: "audience", value: clause };
  }

  if (COMPARISON_PATTERNS.some((pattern) => pattern.test(clause))) {
    return { type: "comparison", value: clause };
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

  if (DESIRE_PATTERNS.some((pattern) => pattern.test(clause))) {
    return { type: "goal", value: clause };
  }

  if (GOAL_VERBS.some((verb) => lower.startsWith(verb))) {
    return { type: "goal", value: clause };
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
    additionalGoals: [],
    constraints: [],
    outputInstructions: [],
    tone: [],
    bias: [],
    biasSignals: [],
    context: [],
    audience: [],
    comparison: [],
    unknown: [],
  };

  for (const clause of clauses) {
    const classified = classifyClause(clause);
    const cleaned = cleanClause(classified.value);

    if (/\b(favor|prefer|recommend)\b/i.test(cleaned)) {
      result.biasSignals.push("outcome_steering");
    }

    if (classified.type === "comparison") {
      result.comparison.push(normalizeComparisonClause(cleaned));
      continue;
    }

    if (
      /\bwhy\s+vault\s+is\s+(better|stronger)\b/i.test(cleaned) ||
      /\bvault\s+is\s+(better|stronger)\b/i.test(cleaned)
    ) {
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
      result.tone.push(normalizeToneClause(cleaned));
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

    if (classified.type === "audience") {
      result.audience.push(cleaned);
      continue;
    }

    if (classified.type === "comparison") {
      result.comparison.push(cleaned);
      continue;
    }

    result.unknown.push(normalizeStepClause(cleaned));
  }

  result.biasSignals = [...new Set(result.biasSignals)];

  return result;
}
