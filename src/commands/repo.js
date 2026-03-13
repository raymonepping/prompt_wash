import {
  printInfo,
  printJson,
  printSuccess,
  printWarning,
} from "../utils/display.js";
import { scanRepository } from "../services/repo/scan.js";
import {
  getGitStatus,
  getGitHistory,
  getGitDiff,
  previewPublishTarget,
  publishPathToGit,
} from "../repo/manager.js";

export function registerRepoCommand(program) {
  const repo = program
    .command("repo")
    .description(
      "Manage PromptWash repository connection, publishing, and history",
    );

  repo
    .command("status")
    .description("Show repository working tree status and PromptWash assets")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (options) => {
      const scan = await scanRepository();
      const gitStatus = await getGitStatus().catch(
        () => "(git status unavailable)",
      );

      const result = {
        command: "repo status",
        scan,
        git_status: gitStatus,
      };

      if (options.output === "json") {
        printJson(result);
        return;
      }

      if (!scan.git.is_git_repo) {
        printWarning("Current directory is not a Git repository");
        printInfo(`Scanned root: ${scan.root}`);
        return;
      }

      printSuccess("Repository status loaded");
      printInfo(`Git root: ${scan.git.root}`);
      printInfo(
        `Working tree clean: ${scan.working_tree.is_clean ? "yes" : "no"}`,
      );
      printInfo(`Prompt candidates: ${scan.prompt_candidates.length}`);
      printInfo(`Lineage families: ${scan.lineage_families.length}`);
      console.log("");
      if (scan.working_tree.is_clean) {
        console.log("(working tree clean)");
      } else {
        console.log("Git status:");
        for (const line of scan.working_tree.status_lines) {
          console.log(line);
        }
      }
    });

  repo
    .command("scan")
    .description(
      "Scan the repository for prompt-related files and PromptWash assets",
    )
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (options) => {
      const scan = await scanRepository();

      const result = {
        command: "repo scan",
        scan,
      };

      if (options.output === "json") {
        printJson(result);
        return;
      }

      if (!scan.git.is_git_repo) {
        printWarning("Scanned directory is not a Git repository");
      } else {
        printSuccess("Repository scan completed successfully");
      }

      printInfo(`Root: ${scan.root}`);
      printInfo(`Prompt candidates: ${scan.prompt_candidates.length}`);
      printInfo(`Lineage families: ${scan.lineage_families.length}`);
      console.log("");

      console.log("Prompt candidates:");
      if (scan.prompt_candidates.length === 0) {
        console.log("(none)");
      } else {
        for (const filePath of scan.prompt_candidates) {
          console.log(`- ${filePath}`);
        }
      }

      console.log("");
      console.log("PromptWash assets:");
      for (const [name, files] of Object.entries(scan.promptwash_assets)) {
        console.log(`- ${name}: ${files.length}`);
      }

      console.log("");
      console.log("Lineage families:");
      if (scan.lineage_families.length === 0) {
        console.log("(none)");
      } else {
        for (const family of scan.lineage_families) {
          console.log(`- ${family}`);
        }
      }
    });

  repo
    .command("connect")
    .description("Connect PromptWash to a git repository remote")
    .argument("[remote]", "Remote name", "origin")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (remote, options) => {
      const result = {
        command: "repo connect",
        remote,
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
      console.log(JSON.stringify(result, null, 2));
    });

  repo
    .command("publish")
    .description("Publish a prompt-related file into the repository")
    .argument("[path]", "Path to publish")
    .option("--dry-run", "Preview the publish flow without changing git", false)
    .option("--confirm", "Stage and commit the selected path locally", false)
    .option("--message <text>", "Explicit commit message")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (targetPath, options) => {
      if (!targetPath) {
        throw new Error("A path is required for repo publish");
      }

      if (!options.confirm) {
        const preview = await previewPublishTarget(targetPath);

        const result = {
          command: "repo publish",
          path: targetPath,
          status: options.dryRun ? "dry_run" : "preview_only",
          message: options.dryRun
            ? "Dry run only. No git mutation was attempted."
            : "No action taken. Use --dry-run to preview or --confirm to stage and commit locally.",
          preview,
          safe_behavior: [
            "No files were staged",
            "No commit was created",
            "No remote push was attempted",
          ],
          ...(options.dryRun
            ? {
                next_steps: [
                  "Review the preview",
                  "Use --confirm to create a local commit",
                  "Add --message to control commit text",
                ],
              }
            : {}),
        };

        if (options.output === "json") {
          printJson(result);
          return;
        }

        printWarning(result.message);
        console.log(JSON.stringify(result, null, 2));
        return;
      }

      const publishResult = await publishPathToGit(targetPath, {
        message: options.message,
      });

      const result = {
        command: "repo publish",
        path: targetPath,
        status: publishResult.committed ? "committed" : "no_changes",
        commit_message: publishResult.commit_message,
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
        printSuccess("Path published to local git history");
      } else {
        printWarning(publishResult.message);
      }

      printInfo(`Path: ${targetPath}`);
      printInfo(`Commit message: ${publishResult.commit_message}`);
      console.log("");
      console.log(JSON.stringify(result, null, 2));
    });

  repo
    .command("history")
    .description("Show git history for a prompt-related path")
    .argument("[path]", "Path to inspect")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (targetPath, options) => {
      if (!targetPath) {
        throw new Error("A path is required for repo history");
      }

      const history = await getGitHistory(targetPath);

      const result = {
        command: "repo history",
        path: targetPath,
        history,
      };

      if (options.output === "json") {
        printJson(result);
        return;
      }

      printSuccess("Git history loaded");
      printInfo(`Path: ${targetPath}`);
      console.log("");
      if (!history.length) {
        console.log("(no history found)");
        return;
      }

      for (const line of history) {
        console.log(line);
      }
    });

  repo
    .command("diff")
    .description("Show git diff for a prompt-related path")
    .argument("[path]", "Path to inspect")
    .option("--range <value>", "Git diff range", "HEAD~1..HEAD")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (targetPath, options) => {
      if (!targetPath) {
        throw new Error("A path is required for repo diff");
      }

      const diff = await getGitDiff(targetPath, options.range);

      const result = {
        command: "repo diff",
        path: targetPath,
        range: options.range,
        diff,
      };

      if (options.output === "json") {
        printJson(result);
        return;
      }

      printSuccess("Git diff loaded");
      printInfo(`Path: ${targetPath}`);
      printInfo(`Range: ${options.range}`);
      console.log("");
      if (!diff.trim()) {
        console.log("(no diff found)");
        return;
      }

      console.log(diff);
    });
}
