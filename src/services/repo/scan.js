import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { createFileError } from "../../utils/errors.js";
import { resolveProjectManifest } from "../project/manifest.js";

const execFileAsync = promisify(execFile);

const PROMPT_EXTENSIONS = new Set([".prompt", ".txt", ".md", ".json"]);

const DEFAULT_PROMPTWASH_DIRECTORIES = [
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

function globToRegExp(pattern) {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*/g, "___DOUBLE_WILDCARD___")
    .replace(/\*/g, "[^/]*")
    .replace(/___DOUBLE_WILDCARD___/g, ".*");

  return new RegExp(`^${escaped}$`);
}

function matchesAnyPattern(relativePath, patterns) {
  return patterns.some((pattern) => globToRegExp(pattern).test(relativePath));
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

async function listConfiguredFiles(rootDir, folders, maxDepth = 4) {
  const results = [];

  for (const folder of folders) {
    const absolutePath = path.join(rootDir, folder);
    const exists = await pathExists(absolutePath);

    if (!exists) {
      continue;
    }

    const stat = await fs.stat(absolutePath);

    if (stat.isDirectory()) {
      const files = await listFilesRecursive(absolutePath, maxDepth);
      results.push(...files);
    } else {
      results.push(absolutePath);
    }
  }

  return results;
}

function dedupeAndSort(values) {
  return [...new Set(values)].sort();
}

function filterPromptCandidates(rootDir, files, manifest) {
  const includePatterns = manifest.include_patterns ?? [];
  const excludePatterns = manifest.exclude_patterns ?? [];

  return dedupeAndSort(
    files
      .map((filePath) => path.relative(rootDir, filePath))
      .filter((relativePath) => isPromptCandidate(path.basename(relativePath)))
      .filter(
        (relativePath) => !matchesAnyPattern(relativePath, excludePatterns),
      )
      .filter((relativePath) => {
        if (includePatterns.length === 0) {
          return true;
        }

        return matchesAnyPattern(relativePath, includePatterns);
      }),
  );
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
  const projectManifestResolution = await resolveProjectManifest();
  const manifest = projectManifestResolution.manifest;

  const configuredPromptFiles = await listConfiguredFiles(
    rootDir,
    manifest.prompt_folders,
    4,
  );

  let discoverySource = "configured_folders";
  let candidateFiles = configuredPromptFiles;

  if (!manifest.strict_prompt_folders) {
    const fallbackFiles = await listFilesRecursive(rootDir, 2);
    candidateFiles = [...configuredPromptFiles, ...fallbackFiles];
    discoverySource = "configured_folders_plus_fallback";
  }

  const promptCandidates = filterPromptCandidates(
    rootDir,
    candidateFiles,
    manifest,
  );

  const promptwashAssetDirs = Array.from(
    new Set([
      ".promptwash",
      ...DEFAULT_PROMPTWASH_DIRECTORIES,
      ...manifest.artifact_folders,
    ]),
  );

  const promptwashAssets = {};

  for (const directory of promptwashAssetDirs) {
    const absolutePath = path.join(rootDir, directory);
    const exists = await pathExists(absolutePath);

    if (!exists) {
      promptwashAssets[directory] = [];
      continue;
    }

    const stat = await fs.stat(absolutePath);

    if (stat.isDirectory()) {
      const files = await listFilesRecursive(absolutePath, 4);
      promptwashAssets[directory] = files
        .map((filePath) => path.relative(rootDir, filePath))
        .sort();
    } else {
      promptwashAssets[directory] = [path.relative(rootDir, absolutePath)];
    }
  }

  const lineageDir = manifest.lineage_dir;
  const lineageAbsolutePath = path.join(rootDir, lineageDir);
  let lineageFamilies = [];

  if (await pathExists(lineageAbsolutePath)) {
    const lineageFiles = await listFilesRecursive(lineageAbsolutePath, 2);
    lineageFamilies = lineageFiles
      .filter((filePath) => filePath.endsWith(".json"))
      .map((filePath) => path.basename(filePath).replace(/\.json$/i, ""))
      .sort();
  }

  return {
    root: rootDir,
    git: repo,
    working_tree: workingTree,
    project_manifest: {
      source: projectManifestResolution.source,
      path:
        projectManifestResolution.source === "project"
          ? ".promptwash/project.json"
          : null,
      manifest,
    },
    prompt_discovery: {
      source: discoverySource,
      strict_prompt_folders: manifest.strict_prompt_folders,
      include_patterns: manifest.include_patterns,
      exclude_patterns: manifest.exclude_patterns,
    },
    prompt_candidates: promptCandidates,
    promptwash_assets: promptwashAssets,
    lineage_families: lineageFamilies,
  };
}
