import { PromptWashError } from "../utils/errors.js";

function buildUrl(baseUrl, path) {
  return `${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function extractJsonObject(text) {
  const direct = safeJsonParse(text);
  if (direct) {
    return direct;
  }

  const fencedMatch = text.match(/```json\s*([\s\S]*?)```/i);
  if (fencedMatch) {
    const parsed = safeJsonParse(fencedMatch[1].trim());
    if (parsed) {
      return parsed;
    }
  }

  const objectMatch = text.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    const parsed = safeJsonParse(objectMatch[0]);
    if (parsed) {
      return parsed;
    }
  }

  return null;
}

export function createOllamaClient(config = {}) {
  const baseUrl = config.baseUrl ?? "http://localhost:11434/api";
  const model = config.model ?? "llama3.2";
  const timeoutMs = config.timeoutMs ?? 30000;

  async function request(path, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(buildUrl(baseUrl, path), {
        ...options,
        signal: controller.signal,
        headers: {
          "content-type": "application/json",
          ...(options.headers ?? {}),
        },
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new PromptWashError("Ollama request failed", {
          code: "OLLAMA_REQUEST_FAILED",
          details: {
            status: response.status,
            statusText: response.statusText,
            body: data,
          },
        });
      }

      return data;
    } catch (error) {
      if (error.name === "AbortError") {
        throw new PromptWashError("Ollama request timed out", {
          code: "OLLAMA_TIMEOUT",
          details: { timeoutMs, baseUrl, path },
        });
      }

      if (error instanceof PromptWashError) {
        throw error;
      }

      throw new PromptWashError("Unable to reach Ollama", {
        code: "OLLAMA_UNREACHABLE",
        details: {
          baseUrl,
          message: error.message,
        },
      });
    } finally {
      clearTimeout(timeout);
    }
  }

  return {
    baseUrl,
    model,
    timeoutMs,

    async healthCheck() {
      try {
        const data = await request("/tags", { method: "GET" });
        const models = Array.isArray(data.models) ? data.models : [];
        const installed = models.some((item) => item.name?.startsWith(model));

        return {
          ok: true,
          reachable: true,
          configured_model: model,
          installed_model: installed,
          available_models: models.map((item) => item.name),
        };
      } catch (error) {
        return {
          ok: false,
          reachable: false,
          configured_model: model,
          installed_model: false,
          available_models: [],
          error: {
            code: error.code ?? "OLLAMA_ERROR",
            message: error.message,
            details: error.details ?? null,
          },
        };
      }
    },

    async generateJson({ systemPrompt, userPrompt }) {
      const data = await request("/generate", {
        method: "POST",
        body: JSON.stringify({
          model,
          prompt: `${systemPrompt.trim()}\n\n${userPrompt.trim()}`,
          stream: false,
          format: "json",
        }),
      });

      const responseText = data.response ?? "";
      const parsed = extractJsonObject(responseText);

      if (!parsed) {
        throw new PromptWashError(
          "Ollama returned non-JSON enrichment output",
          {
            code: "OLLAMA_INVALID_JSON",
            details: {
              response: responseText,
            },
          },
        );
      }

      return {
        raw: responseText,
        parsed,
      };
    },
  };
}
