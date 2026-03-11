import { createOllamaClient } from "../ollama/client.js";
import { resolveConfig } from "../config/loader.js";

function sanitizeEnrichment(value) {
  const result = {
    goal: "",
    context: "",
    audience: "",
    constraints: [],
    steps: [],
    output_format: "",
    tone: "",
  };

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return result;
  }

  if (typeof value.goal === "string") {
    result.goal = value.goal.trim();
  }

  if (typeof value.context === "string") {
    result.context = value.context.trim();
  }

  if (typeof value.audience === "string") {
    result.audience = value.audience.trim();
  }

  if (typeof value.output_format === "string") {
    result.output_format = value.output_format.trim();
  }

  if (typeof value.tone === "string") {
    result.tone = value.tone.trim();
  }

  if (Array.isArray(value.constraints)) {
    result.constraints = value.constraints
      .filter((item) => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (Array.isArray(value.steps)) {
    result.steps = value.steps
      .filter((item) => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return result;
}

export async function enrichPromptObject(promptObject) {
  const config = await resolveConfig();
  const client = createOllamaClient(config.ollama);
  const health = await client.healthCheck();

  if (!health.ok || !health.installed_model) {
    return {
      requested: true,
      succeeded: false,
      enrichment: null,
      reason: "Ollama is unavailable or configured model is not installed.",
      health,
    };
  }

  const systemPrompt = `
You are helping improve a deterministic prompt parser.

Return only valid JSON.
Do not include markdown fences.
Do not invent facts.
Do not paraphrase unless the prompt itself already makes the meaning explicit.
Prefer empty strings or empty arrays over guessing.

Important extraction rules:
- "goal" should be the main task sentence only.
- "context" should only be additional background context, not the task itself.
- Do not put constraints into "context".
- Do not put output format instructions into "context".
- "constraints" should only contain explicit limits or prohibitions.
- "steps" should only contain explicit task or instruction steps.
- "output_format" should be a simple canonical label when possible, like "markdown", "json", "table", "bullet_list", or "summary".
- "audience" should only be filled when explicitly present.
- "tone" should only be filled when explicitly present.

Expected JSON schema:
{
  "goal": "string",
  "context": "string",
  "audience": "string",
  "constraints": ["string"],
  "steps": ["string"],
  "output_format": "string",
  "tone": "string"
}
  `;

  const userPrompt = `
Deterministic parse summary:
- goal: ${promptObject.ir.goal}
- audience: ${promptObject.ir.audience}
- context: ${promptObject.ir.context}
- constraints: ${JSON.stringify(promptObject.ir.constraints)}
- steps: ${JSON.stringify(promptObject.ir.steps)}
- output_format: ${promptObject.ir.output_format}
- tone: ${promptObject.ir.tone}

Raw prompt:
${promptObject.cleaned}
  `;

  try {
    const response = await client.generateJson({
      systemPrompt,
      userPrompt,
    });

    return {
      requested: true,
      succeeded: true,
      enrichment: sanitizeEnrichment(response.parsed),
      reason: null,
      health,
    };
  } catch (error) {
    return {
      requested: true,
      succeeded: false,
      enrichment: null,
      reason: error.message,
      health,
    };
  }
}
