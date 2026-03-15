export function segmentPrompt(text) {
  if (!text) return []

  return text
    .replace(/\band\b/gi, ",")
    .replace(/\bbut\b/gi, ",")
    .replace(/\balso\b/gi, ",")
    .split(/[.,]/)
    .map((c) => c.trim())
    .filter(Boolean)
}