export function createEmptyPromptIr() {
  return {
    goal: "",
    audience: "",
    context: "",
    constraints: [],
    steps: [],
    output_format: "",
    tone: "",
    language: "",
    variants: {},
    tokens: {},
    metadata: {}
  };
}