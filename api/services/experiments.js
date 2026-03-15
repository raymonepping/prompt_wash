import fs from "node:fs/promises";
import path from "node:path";

const EXPERIMENTS_DIR = path.resolve(".promptwash/experiments");

export async function fetchExperiments() {
  try {
    const files = await fs.readdir(EXPERIMENTS_DIR);
    return { experiments: files.filter((file) => file.endsWith(".json")) };
  } catch {
    return { experiments: [] };
  }
}

export async function fetchExperimentById(id) {
  const filePath = path.join(EXPERIMENTS_DIR, `${id}.json`);
  const raw = await fs.readFile(filePath, "utf8");
  return { experiment: JSON.parse(raw) };
}

export async function executeExperiment({
  prompt,
  variants = [],
  model = null,
}) {
  return {
    message: "Experiment route wired successfully",
    input: {
      prompt,
      variants,
      model,
    },
  };
}
