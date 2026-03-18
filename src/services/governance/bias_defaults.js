export const DEFAULT_BIAS_RULES = {
  version: 2,
  categories: {
    outcome_steering: {
      weight: 35,
      enabled: true,
      patterns: [
        "prove that",
        "show why",
        "demonstrate why",
        "make the case that",
        "explain why",
        "justify why",
        { type: "regex", value: "\\bwhy\\s+[^\\n.?!]{0,80}\\s+is\\s+better\\b", flags: "i" },
        { type: "regex", value: "\\bwhy\\s+[^\\n.?!]{0,80}\\s+is\\s+stronger\\b", flags: "i" },
        { type: "regex", value: "\\bwhy\\s+[^\\n.?!]{0,80}\\s+is\\s+worse\\b", flags: "i" },
      ],
    },
    vendor_bias: {
      weight: 25,
      enabled: true,
      patterns: [
        "beats",
        "better than",
        "superior to",
        "clearly beats",
        "clearly better than",
        "wins against",
        { type: "regex", value: "\\b(vault|openbao)\\s+is\\s+better\\s+than\\s+(vault|openbao)\\b", flags: "i" },
        { type: "regex", value: "\\b(vault|openbao)\\s+is\\s+superior\\s+to\\s+(vault|openbao)\\b", flags: "i" },
      ],
    },
    advocacy_language: {
      weight: 20,
      enabled: true,
      patterns: [
        "clearly",
        "obviously",
        "best by far",
        "far superior",
        "clearly superior",
        "undeniably",
        "strong recommendation",
      ],
    },
    forced_recommendation: {
      weight: 30,
      enabled: true,
      patterns: [
        "recommend",
        "strong recommendation",
        "end with a recommendation",
        "conclude that",
        "final recommendation",
        "recommendation on why",
      ],
    },
  },
  thresholds: {
    very_low: 20,
    low: 40,
    medium: 60,
    high: 80,
  },
};

export function cloneDefaultBiasRules() {
  return structuredClone(DEFAULT_BIAS_RULES);
}