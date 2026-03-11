import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";

import { PromptWashError } from "../utils/errors.js";

const execFileAsync = promisify(execFile);

async function runGit(args) {
  try {
    const result = await execFileAsync("git", args, {
      encoding: "utf8"
    });

    return (result.stdout || "").trim();
  } catch (error) {
    const stderr = error.stderr?.trim() || error.message;

    throw new PromptWashError("Git command failed", {
      code: "GIT_ERROR",
      details: {
        args,
        stderr
      }
    });
  }
}

export async function isGitRepository() {
  try {
    const output = await runGit(["rev-parse", "--is-inside-work-tree"]);
    return output === "true";
  } catch {
    return false;
  }
}

export async function getRepoHistory(targetPath = null) {
  const args = ["log", "--oneline", "--decorate", "--max-count=20"];

  if (targetPath) {
    args.push("--", targetPath);
  }

  return await runGit(args);
}

export async function getRepoDiff(targetPath = null, fromRef = "HEAD~1", toRef = "HEAD") {
  const args = ["diff", `${fromRef}..${toRef}`];

  if (targetPath) {
    args.push("--", targetPath);
  }

  return await runGit(args);
}

export async function getRepoStatus() {
  return await runGit(["status", "--short"]);
}

export async function validatePublishTarget(targetPath) {
  if (!targetPath) {
    throw new PromptWashError("Publish target path is required.", {
      code: "PUBLISH_TARGET_REQUIRED"
    });
  }

  try {
    const stat = await fs.stat(targetPath);

    return {
      exists: true,
      type: stat.isDirectory() ? "directory" : "file",
      path: targetPath
    };
  } catch {
    throw new PromptWashError("Publish target does not exist.", {
      code: "PUBLISH_TARGET_MISSING",
      details: { path: targetPath }
    });
  }
}

export async function previewPublishTarget(targetPath) {
  const validated = await validatePublishTarget(targetPath);
  const status = await getRepoStatus();

  return {
    target: validated,
    git_status: status,
    would_stage: [validated.path],
    would_commit: false,
    would_push: false
  };
}

export async function stagePublishTarget(targetPath) {
  await validatePublishTarget(targetPath);
  await runGit(["add", "--", targetPath]);

  return {
    staged: [targetPath]
  };
}

export async function hasStagedChanges() {
  const output = await runGit(["diff", "--cached", "--name-only"]);
  return output.trim().length > 0;
}

export async function createCommit(message) {
  if (!message || !message.trim()) {
    throw new PromptWashError("Commit message is required.", {
      code: "COMMIT_MESSAGE_REQUIRED"
    });
  }

  await runGit(["commit", "-m", message.trim()]);
  const latest = await runGit(["log", "--oneline", "--max-count=1"]);

  return {
    commit: latest
  };
}

export async function publishTarget(targetPath, message) {
  const target = await validatePublishTarget(targetPath);
  const beforeStatus = await getRepoStatus();

  const stageResult = await stagePublishTarget(target.path);
  const stagedChanges = await hasStagedChanges();

  if (!stagedChanges) {
    return {
      target,
      before_status: beforeStatus,
      staged: stageResult.staged,
      committed: false,
      pushed: false,
      message: "No staged changes detected. Nothing was committed."
    };
  }

  const commitResult = await createCommit(message);

  return {
    target,
    before_status: beforeStatus,
    staged: stageResult.staged,
    committed: true,
    pushed: false,
    commit: commitResult.commit,
    message: "Publish commit created locally. No push was attempted."
  };
}