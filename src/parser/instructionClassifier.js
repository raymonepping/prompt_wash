import { segmentPrompt } from "./segmentPrompt.js";
import { classifyClause } from "./classifyClause.js";

export function classifyInstructions(prompt) {
  const clauses = segmentPrompt(prompt);

  const result = {
    goal: null,
    constraints: [],
    tone: [],
    bias: [],
    context: [],
  };

  for (const clause of clauses) {
    const c = classifyClause(clause);

    if (c.type === "goal" && !result.goal) {
      result.goal = c.value;
    } else if (c.type === "constraint") {
      result.constraints.push(c.value);
    } else if (c.type === "tone") {
      result.tone.push(c.value);
    } else if (c.type === "bias") {
      result.bias.push(c.value);
    } else {
      result.context.push(c.value);
    }
  }

  return result;
}
