const FILLER_PATTERNS = [
  /\bjust\b/gi,
  /\bactually\b/gi,
  /\bmaybe\b/gi,
  /\bkind of\b/gi,
  /\bsort of\b/gi,
  /\bplease\b/gi
];

export async function cleanPromptInput(input) {
  let output = input;

  for (const pattern of FILLER_PATTERNS) {
    output = output.replace(pattern, "");
  }

  return output
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}