function sanitizeName(value) {
  const fallback = "prompt";

  if (!value || typeof value !== "string") {
    return fallback;
  }

  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return cleaned || fallback;
}

function nextSuffix(index) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  let value = index;
  let suffix = "";

  do {
    suffix = alphabet[value % 26] + suffix;
    value = Math.floor(value / 26) - 1;
  } while (value >= 0);

  return suffix;
}

export function toLineageFamilyName(input) {
  return sanitizeName(input);
}

export function nextChildNodeId(record, parentId) {
  const children = record.nodes.filter((node) => node.parent === parentId);
  const suffix = nextSuffix(children.length);
  return `${parentId}.${suffix}`;
}
