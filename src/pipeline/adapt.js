function compactWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

function formatList(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

export function adaptPrompt(promptObject, provider = "generic") {
  const goal = promptObject.ir.goal || "";
  const context = promptObject.ir.context || "";
  const constraints = promptObject.ir.constraints || [];
  const outputFormat = promptObject.ir.output_format || "";
  const audience = promptObject.ir.audience || "general";

  switch (provider) {
    case "compact":
      return compactWhitespace(
        [
          goal,
          constraints.length > 0 && `Constraints: ${constraints.join("; ")}`,
          outputFormat && `Output: ${outputFormat}`,
          audience !== "general" && `Audience: ${audience}`,
          context && `Context: ${context}`,
        ]
          .filter(Boolean)
          .join(" "),
      );

    case "openai":
      return [
        context ? `Context:\n${context}\n` : "",
        `Task:\n${goal}\n`,
        constraints.length > 0
          ? `Constraints:\n${formatList(constraints)}\n`
          : "",
        outputFormat ? `Output format:\n${outputFormat}\n` : "",
        audience !== "general" ? `Audience:\n${audience}\n` : "",
      ]
        .filter(Boolean)
        .join("\n")
        .trim();

    case "claude":
      return [
        "You are a careful assistant.",
        context ? `Context:\n${context}\n` : "",
        `Request:\n${goal}\n`,
        constraints.length > 0
          ? `Constraints:\n${formatList(constraints)}\n`
          : "",
        outputFormat ? `Desired output:\n${outputFormat}\n` : "",
        audience !== "general" ? `Audience:\n${audience}\n` : "",
      ]
        .filter(Boolean)
        .join("\n")
        .trim();

    case "generic":
    default:
      return [
        context ? `Context:\n${context}\n` : "",
        `Task:\n${goal}\n`,
        constraints.length > 0
          ? `Constraints:\n${formatList(constraints)}\n`
          : "",
        outputFormat ? `Output format:\n${outputFormat}\n` : "",
        audience !== "general" ? `Audience:\n${audience}\n` : "",
      ]
        .filter(Boolean)
        .join("\n")
        .trim();
  }
}

export function scoreRenderedVariants(variants) {
  const genericText = variants.generic ?? "";
  const compactText = variants.compact ?? "";

  const genericTokens = Math.ceil(genericText.length / 4);
  const compactTokens = Math.ceil(compactText.length / 4);

  const savedTokens = Math.max(genericTokens - compactTokens, 0);
  const savedPercent =
    genericTokens > 0 ? Math.round((savedTokens / genericTokens) * 100) : 0;

  return {
    generic_tokens: genericTokens,
    compact_tokens: compactTokens,
    saved_tokens: savedTokens,
    saved_percent: savedPercent,
  };
}
