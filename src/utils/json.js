export function tryParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
