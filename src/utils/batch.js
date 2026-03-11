import fs from "node:fs/promises";
import path from "node:path";

function isSupportedFile(filename) {
  const lower = filename.toLowerCase();

  return (
    lower.endsWith(".json") ||
    lower.endsWith(".md") ||
    lower.endsWith(".txt") ||
    lower.endsWith(".prompt")
  );
}

export async function listBatchFiles(targetPath) {
  const stat = await fs.stat(targetPath);

  if (stat.isFile()) {
    return [targetPath];
  }

  if (!stat.isDirectory()) {
    return [];
  }

  const entries = await fs.readdir(targetPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (!entry.isFile()) {
      continue;
    }

    if (!isSupportedFile(entry.name)) {
      continue;
    }

    files.push(path.join(targetPath, entry.name));
  }

  return files.sort();
}

export function summarizeBatchResults(results) {
  const summary = {
    total_files: results.length,
    successful: 0,
    failed: 0,
    total_warnings: 0,
    total_errors: 0,
  };

  for (const item of results) {
    if (item.ok) {
      summary.successful += 1;
      summary.total_warnings += item.result?.lint_summary?.warnings ?? 0;
      summary.total_errors += item.result?.lint_summary?.errors ?? 0;
    } else {
      summary.failed += 1;
    }
  }

  return summary;
}