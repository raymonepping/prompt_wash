export function assertProviderResponse(result) {
  if (!result || typeof result !== "object") {
    throw new Error("Provider response must be an object");
  }

  if (typeof result.text !== "string") {
    throw new Error("Provider response must include text");
  }

  if (typeof result.model !== "string" || !result.model.trim()) {
    throw new Error("Provider response must include model");
  }

  if (
    typeof result.latency_ms !== "number" ||
    Number.isNaN(result.latency_ms)
  ) {
    throw new Error("Provider response must include latency_ms");
  }
}
