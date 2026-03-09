import { execFile } from "node:child_process";
import { promisify } from "node:util";

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