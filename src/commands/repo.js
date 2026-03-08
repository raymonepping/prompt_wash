import { printInfo } from "../utils/display.js";

export function registerRepoCommand(program) {
  const repo = program
    .command("repo")
    .description("Manage prompt repository connection, publishing, and history");

  repo
    .command("connect")
    .description("Connect PromptWash to a git repository")
    .argument("[remote]", "Repository URL or remote name")
    .action(async (remote) => {
      printInfo("repo connect scaffold is ready");
      console.log({ command: "repo connect", remote: remote ?? null });
    });

  repo
    .command("publish")
    .description("Publish prompt assets into the repository")
    .argument("[path]", "Prompt file or folder path")
    .action(async (pathValue) => {
      printInfo("repo publish scaffold is ready");
      console.log({ command: "repo publish", path: pathValue ?? null });
    });

  repo
    .command("history")
    .description("Show prompt history")
    .argument("[path]", "Prompt file path")
    .action(async (pathValue) => {
      printInfo("repo history scaffold is ready");
      console.log({ command: "repo history", path: pathValue ?? null });
    });

  repo
    .command("diff")
    .description("Show version diff for a prompt")
    .argument("[path]", "Prompt file path")
    .option("--from <ref>", "From git ref")
    .option("--to <ref>", "To git ref")
    .action(async (pathValue, options) => {
      printInfo("repo diff scaffold is ready");
      console.log({ command: "repo diff", path: pathValue ?? null, options });
    });
}