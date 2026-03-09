import { PromptWashError } from "../utils/errors.js";

function buildUrl(baseUrl, path) {
  return `${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
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
          ...(options.headers ?? {})
        }
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new PromptWashError("Ollama request failed", {
          code: "OLLAMA_REQUEST_FAILED",
          details: {
            status: response.status,
            statusText: response.statusText,
            body: data
          }
        });
      }

      return data;
    } catch (error) {
      if (error.name === "AbortError") {
        throw new PromptWashError("Ollama request timed out", {
          code: "OLLAMA_TIMEOUT",
          details: { timeoutMs, baseUrl, path }
        });
      }

      if (error instanceof PromptWashError) {
        throw error;
      }

      throw new PromptWashError("Unable to reach Ollama", {
        code: "OLLAMA_UNREACHABLE",
        details: {
          baseUrl,
          message: error.message
        }
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
          available_models: models.map((item) => item.name)
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
            details: error.details ?? null
          }
        };
      }
    }
  };
}