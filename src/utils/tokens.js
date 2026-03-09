export function estimateTokens(text) {
  if (!text || typeof text !== "string") {
    return 0;
  }

  return Math.ceil(text.trim().length / 4);
}
