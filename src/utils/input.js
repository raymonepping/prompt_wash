export function isLikelyFilePath(value) {
  if (!value) {
    return false;
  }

  return value.includes("/") || value.includes("\\") || value.endsWith(".txt") || value.endsWith(".md") || value.endsWith(".json");
}