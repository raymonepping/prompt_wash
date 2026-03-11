import {
  printInfo,
  printJson,
  printSuccess,
  printWarning,
} from "../utils/display.js";
import { PromptWashError } from "../utils/errors.js";
import {
  getRepoDiff,
  getRepoHistory,
  getRepoStatus,
  isGitRepository,
  previewPublishTarget,
  publishTarget,
} from "../repo/manager.js";

async function ensureGitRepo() {
  const insideRepo = await isGitRepository();

  if (!insideRepo) {
    throw new PromptWashError("Current directory is not a Git repository.", {
      code: "NOT_A_GIT_REPO",
      details: "Run this command inside a Git working tree.",
    });
  }
}

export function registerRepoCommand(program) {
  const repo = program
    .command("repo")
    .description(
      "Manage prompt repository connection, publishing, and history",
    );

  repo
    .command("connect")
    .description("Connect PromptWash to a git repository")
    .argument("[remote]", "Repository URL or remote name")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (remote, options) => {
      await ensureGitRepo();

      const result = {
        command: "repo connect",
        remote: remote ?? "origin",
        status: "scaffold_only",
        message: "Remote connection management is not implemented yet.",
        next_steps: [
          "Validate the remote exists or can be added",
          "Store PromptWash repository metadata",
          "Support prompt publishing workflows safely",
        ],
      };

      if (options.output === "json") {
        printJson(result);
        return;
      }

      printWarning(result.message);
      printJson(result);
    });

  repo
    .command("publish")
    .description("Publish prompt assets into the repository")
    .argument("[path]", "Prompt file or folder path")
    .option("--dry-run", "Preview publish behavior without mutating git", false)
    .option("--confirm", "Stage and commit the selected path locally", false)
    .option("-m, --message <message>", "Commit message")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (pathValue, options) => {
      await ensureGitRepo();

      if (options.dryRun && options.confirm) {
        throw new PromptWashError(
          "Use either --dry-run or --confirm, not both.",
          {
            code: "INVALID_PUBLISH_MODE",
          },
        );
      }

      if (!options.dryRun && !options.confirm) {
        const preview = await previewPublishTarget(pathValue ?? null);

        const result = {
          command: "repo publish",
          path: pathValue ?? null,
          status: "preview_only",
          message:
            "No action taken. Use --dry-run to preview or --confirm to stage and commit locally.",
          preview,
          safe_behavior: [
            "No files were staged",
            "No commit was created",
            "No remote push was attempted",
          ],
        };

        if (options.output === "json") {
          printJson(result);
          return;
        }

        printWarning(result.message);
        printJson(result);
        return;
      }

      if (options.dryRun) {
        const preview = await previewPublishTarget(pathValue ?? null);

        const result = {
          command: "repo publish",
          path: pathValue ?? null,
          status: "dry_run",
          message: "Dry run only. No git mutation was attempted.",
          preview,
          safe_behavior: [
            "No files were staged",
            "No commit was created",
            "No remote push was attempted",
          ],
          next_steps: [
            "Review the preview",
            "Use --confirm to create a local commit",
            "Add --message to control commit text",
          ],
        };

        if (options.output === "json") {
          printJson(result);
          return;
        }

        printWarning(result.message);
        printJson(result);
        return;
      }

      const commitMessage =
        options.message ??
        `PromptWash publish: ${pathValue ?? "selected target"}`;

      const publishResult = await publishTarget(
        pathValue ?? null,
        commitMessage,
      );

      const result = {
        command: "repo publish",
        path: pathValue ?? null,
        status: publishResult.committed ? "committed" : "no_changes",
        commit_message: commitMessage,
        result: publishResult,
        safe_behavior: [
          "Only the selected path was staged",
          "A local commit may have been created",
          "No remote push was attempted",
        ],
      };

      if (options.output === "json") {
        printJson(result);
        return;
      }

      if (publishResult.committed) {
        printSuccess("Publish commit created locally");
        printInfo(`Commit: ${publishResult.commit}`);
      } else {
        printWarning(publishResult.message);
      }

      printInfo(`Path: ${pathValue ?? "(none)"}`);
      printInfo(`Commit message: ${commitMessage}`);
      console.log("");
      printJson(result);
    });

  repo
    .command("history")
    .description("Show prompt history")
    .argument("[path]", "Prompt file path")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (pathValue, options) => {
      await ensureGitRepo();

      const history = await getRepoHistory(pathValue ?? null);

      if (options.output === "json") {
        printJson({
          command: "repo history",
          path: pathValue ?? null,
          history,
        });
        return;
      }

      printSuccess("Git history loaded");
      if (pathValue) {
        printInfo(`Path: ${pathValue}`);
      }
      console.log("");
      console.log(history || "(no history found)");
    });

  repo
    .command("diff")
    .description("Show version diff for a prompt")
    .argument("[path]", "Prompt file path")
    .option("--from <ref>", "From git ref", "HEAD~1")
    .option("--to <ref>", "To git ref", "HEAD")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (pathValue, options) => {
      await ensureGitRepo();

      const diff = await getRepoDiff(
        pathValue ?? null,
        options.from,
        options.to,
      );

      if (options.output === "json") {
        printJson({
          command: "repo diff",
          path: pathValue ?? null,
          from: options.from,
          to: options.to,
          diff,
        });
        return;
      }

      printSuccess("Git diff loaded");
      if (pathValue) {
        printInfo(`Path: ${pathValue}`);
      }
      printInfo(`Range: ${options.from}..${options.to}`);
      console.log("");
      console.log(diff || "(no diff found)");
    });

  repo
    .command("status")
    .description("Show working tree status")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (options) => {
      await ensureGitRepo();

      const status = await getRepoStatus();

      if (options.output === "json") {
        printJson({
          command: "repo status",
          status,
        });
        return;
      }

      printSuccess("Git status loaded");
      console.log("");
      console.log(status || "(working tree clean)");
    });
}
