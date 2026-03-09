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
    tone: ""
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
      ok: false,
      enrichment: null,
      reason: "Ollama is unavailable or configured model is not installed.",
      health
    };
  }

  const systemPrompt = `
You are helping improve a deterministic prompt parser.
Return only valid JSON.
Do not invent facts.
Only extract what is explicitly present in the prompt.
If a field is unclear, return an empty string or empty array.

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
Raw prompt:
${promptObject.cleaned}
  `;

  const response = await client.generateJson({
    systemPrompt,
    userPrompt
  });

  return {
    ok: true,
    enrichment: sanitizeEnrichment(response.parsed),
    reason: null,
    health
  };
}