import { Command } from "commander";

import { registerParseCommand } from "./commands/parse.js";
import { registerRenderCommand } from "./commands/render.js";
import { registerCheckCommand } from "./commands/check.js";
import { registerRepoCommand } from "./commands/repo.js";
import { registerConstraintsCommand } from "./commands/constraints.js";
import { registerConfigCommand } from "./commands/config.js";
import { registerBundleCommand } from "./commands/bundle.js";
import { registerBatchCheckCommand } from "./commands/batch-check.js";
import { registerRiskCommand } from "./commands/risk.js";
import { registerRiskRulesCommand } from "./commands/risk-rules.js";
import { registerBiasCommand } from "./commands/bias.js";
import { registerBiasRulesCommand } from "./commands/bias-rules.js";
import { registerLineageCommand } from "./commands/lineage.js";
import { registerRunCommand } from "./commands/run.js";
import { registerRunsCommand } from "./commands/runs.js";
import { registerOptimizeCommand } from "./commands/optimize.js";
import { registerEvaluateCommand } from "./commands/evaluate.js";
import { registerCompareRunsCommand } from "./commands/compare-runs.js";
import { registerIntelligenceCommand } from "./commands/intelligence.js";

export async function runCli(argv = process.argv) {
  const program = new Command();

  program
    .name("promptwash")
    .alias("pw")
    .description(
      "Local-first prompt engineering toolkit for cleaning, analyzing, optimizing, validating, benchmarking, and managing prompts.",
    )
    .version("0.1.0");

  registerParseCommand(program);
  registerRenderCommand(program);
  registerCheckCommand(program);
  registerRepoCommand(program);
  registerConstraintsCommand(program);
  registerConfigCommand(program);
  registerBundleCommand(program);
  registerBatchCheckCommand(program);
  registerRiskCommand(program);
  registerRiskRulesCommand(program);
  registerBiasCommand(program);
  registerBiasRulesCommand(program);
  registerLineageCommand(program);
  registerRunCommand(program);
  registerRunsCommand(program);
  registerOptimizeCommand(program);
  registerEvaluateCommand(program);
  registerCompareRunsCommand(program);
  registerIntelligenceCommand(program);

  await program.parseAsync(argv);
}
