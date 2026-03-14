import { scanRepository } from "../repo/scan.js";

function classifyOptimizationFiles(files) {
  const optimized = files.filter((filePath) =>
    /compact|optimized|optimize/i.test(filePath),
  );

  const baseline = files.filter(
    (filePath) => !/compact|optimized|optimize/i.test(filePath),
  );

  return {
    optimized,
    baseline,
  };
}

export async function buildOptimizationIntelligence() {
  const scan = await scanRepository();
  const files = scan.prompt_candidates ?? [];
  const classified = classifyOptimizationFiles(files);

  return {
    total_prompt_candidates: files.length,
    optimized_candidates: classified.optimized.length,
    baseline_candidates: classified.baseline.length,
    optimized_files: classified.optimized,
    note:
      classified.optimized.length === 0
        ? "No optimized prompt artifacts detected yet."
        : "Optimization artifact discovery is active. Exact savings aggregation can be added in a later step by indexing optimization result files directly.",
  };
}
