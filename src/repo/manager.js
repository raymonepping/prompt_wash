import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

import { createFileError, createValidationError } from "../utils/errors.js";

const execFileAsync = promisify(execFile);

async function pathExists(pathValue) {
  try {
    await fs.access(pathValue);
    return true;
  } catch {
    return false;
  }
}

async function runGit(args, cwd = process.cwd()) {
  try {
    const { stdout } = await execFileAsync("git", args, { cwd });
    return stdout.trim();
  } catch (error) {
    if (error.code === "ENOENT") {
      throw createFileError("Git is not installed or not available in PATH", error.message);
    }

    throw createFileError(`Git command failed: git ${args.join(" ")}`, error.message);
  }
}

async function ensureGitRepo(cwd = process.cwd()) {
  try {
    await runGit(["rev-parse", "--show-toplevel"], cwd);
  } catch (error) {
    throw createValidationError("Current directory is not a Git repository", [
      error.message,
    ]);
  }
}

export async function getGitStatus(cwd = process.cwd()) {
  await ensureGitRepo(cwd);
  return runGit(["status", "--short"], cwd);
}

export async function getGitHistory(targetPath, cwd = process.cwd()) {
  await ensureGitRepo(cwd);

  const output = await runGit(
    ["log", "--date=short", '--pretty=format:%h %ad - %s', "--", targetPath],
    cwd,
  );

  return output
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function getGitDiff(targetPath, range = "HEAD~1..HEAD", cwd = process.cwd()) {
  await ensureGitRepo(cwd);
  return runGit(["diff", range, "--", targetPath], cwd);
}

export async function previewPublishTarget(targetPath, cwd = process.cwd()) {
  await ensureGitRepo(cwd);

  const absolutePath = path.resolve(cwd, targetPath);
  const exists = await pathExists(absolutePath);

  const target = {
    exists,
    type: exists ? "file" : "missing",
    path: targetPath,
  };

  const gitStatus = await getGitStatus(cwd).catch(() => "");

  return {
    target,
    git_status: gitStatus,
    would_stage: exists ? [targetPath] : [],
    would_commit: false,
    would_push: false,
  };
}

export async function publishPathToGit(
  targetPath,
  { message } = {},
  cwd = process.cwd(),
) {
  await ensureGitRepo(cwd);

  const absolutePath = path.resolve(cwd, targetPath);
  const exists = await pathExists(absolutePath);

  if (!exists) {
    throw createValidationError(`Publish target does not exist: ${targetPath}`);
  }

  const beforeStatus = await getGitStatus(cwd).catch(() => "");

  await runGit(["add", "--", targetPath], cwd);

  const afterStageStatus = await getGitStatus(cwd).catch(() => "");
  const commitMessage = message ?? `PromptWash publish: ${targetPath}`;

  if (!afterStageStatus.trim()) {
    return {
      target: {
        exists: true,
        type: "file",
        path: targetPath,
      },
      before_status: beforeStatus,
      staged: [targetPath],
      committed: false,
      pushed: false,
      commit_message: commitMessage,
      message: "No staged changes detected. Nothing was committed.",
    };
  }

  try {
    await runGit(["commit", "-m", commitMessage], cwd);
  } catch (error) {
    const statusAfterCommitAttempt = await getGitStatus(cwd).catch(() => "");
    if (!statusAfterCommitAttempt.trim()) {
      return {
        target: {
          exists: true,
          type: "file",
          path: targetPath,
        },
        before_status: beforeStatus,
        staged: [targetPath],
        committed: false,
        pushed: false,
        commit_message: commitMessage,
        message: "No staged changes detected. Nothing was committed.",
      };
    }

    throw error;
  }

  return {
    target: {
      exists: true,
      type: "file",
      path: targetPath,
    },
    before_status: beforeStatus,
    staged: [targetPath],
    committed: true,
    pushed: false,
    commit_message: commitMessage,
    message: "Local commit created successfully.",
  };
}