import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { createFileError } from "../../utils/errors.js";

const execFileAsync = promisify(execFile);

const PROMPT_EXTENSIONS = new Set([".prompt", ".txt", ".md", ".json"]);

const PROMPTWASH_DIRECTORIES = [
  ".promptwash",
  "artifacts",
  "bundle",
  "bundles",
  "reports",
  "prompts",
];

function normalizeLines(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function isPromptCandidate(filename) {
  const ext = path.extname(filename).toLowerCase();
  return PROMPT_EXTENSIONS.has(ext);
}

async function pathExists(pathValue) {
  try {
    await fs.access(pathValue);
    return true;
  } catch {
    return false;
  }
}

async function listFilesRecursive(rootDir, maxDepth = 3, currentDepth = 0) {
  const results = [];

  if (currentDepth > maxDepth) {
    return results;
  }

  let entries;
  try {
    entries = await fs.readdir(rootDir, { withFileTypes: true });
  } catch (error) {
    throw createFileError(
      `Unable to read directory: ${rootDir}`,
      error.message,
    );
  }

  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === ".git" || entry.name === "node_modules") {
        continue;
      }

      results.push(
        ...(await listFilesRecursive(fullPath, maxDepth, currentDepth + 1)),
      );
      continue;
    }

    results.push(fullPath);
  }

  return results;
}

async function runGit(args, cwd = process.cwd()) {
  try {
    const { stdout } = await execFileAsync("git", args, { cwd });
    return stdout.trim();
  } catch (error) {
    if (error.code === "ENOENT") {
      throw createFileError(
        "Git is not installed or not available in PATH",
        error.message,
      );
    }

    throw error;
  }
}

export async function detectGitRepository(cwd = process.cwd()) {
  try {
    const root = await runGit(["rev-parse", "--show-toplevel"], cwd);
    return {
      is_git_repo: true,
      root,
    };
  } catch {
    return {
      is_git_repo: false,
      root: null,
    };
  }
}

export async function getGitWorkingTreeStatus(cwd = process.cwd()) {
  const repo = await detectGitRepository(cwd);

  if (!repo.is_git_repo) {
    return {
      is_git_repo: false,
      is_clean: null,
      status_lines: [],
    };
  }

  const output = await runGit(["status", "--short"], cwd);
  const statusLines = normalizeLines(output);

  return {
    is_git_repo: true,
    is_clean: statusLines.length === 0,
    status_lines: statusLines,
  };
}

export async function scanRepository(cwd = process.cwd()) {
  const repo = await detectGitRepository(cwd);
  const workingTree = await getGitWorkingTreeStatus(cwd);

  const rootDir = repo.root ?? cwd;
  const allFiles = await listFilesRecursive(rootDir, 3);

  const promptCandidates = allFiles
    .filter((filePath) => isPromptCandidate(path.basename(filePath)))
    .map((filePath) => path.relative(rootDir, filePath))
    .sort();

  const promptwashAssets = {};

  for (const directory of PROMPTWASH_DIRECTORIES) {
    const absolutePath = path.join(rootDir, directory);
    const exists = await pathExists(absolutePath);

    if (!exists) {
      promptwashAssets[directory] = [];
      continue;
    }

    const stat = await fs.stat(absolutePath);

    if (stat.isDirectory()) {
      const files = await listFilesRecursive(absolutePath, 3);
      promptwashAssets[directory] = files
        .map((filePath) => path.relative(rootDir, filePath))
        .sort();
    } else {
      promptwashAssets[directory] = [path.relative(rootDir, absolutePath)];
    }
  }

  const lineageFamilies =
    promptwashAssets[".promptwash"]?.filter(
      (filePath) =>
        filePath.startsWith(".promptwash/lineage/") &&
        filePath.endsWith(".json"),
    ) ?? [];

  return {
    root: rootDir,
    git: repo,
    working_tree: workingTree,
    prompt_candidates: promptCandidates,
    promptwash_assets: promptwashAssets,
    lineage_families: lineageFamilies.map((filePath) =>
      path.basename(filePath).replace(/\.json$/i, ""),
    ),
  };
}
