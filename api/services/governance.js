import fs from "node:fs/promises";
import path from "node:path";
import { runPipeline } from "../../src/pipeline/index.js";
import { analyzePromptRisk } from "../../src/services/governance/risk_scoring.js";
import { analyzePromptBias } from "../../src/services/governance/bias_detection.js";

const RISK_RULES_PATH = path.resolve(".promptwash/risk-rules.json");
const BIAS_RULES_PATH = path.resolve(".promptwash/bias-rules.json");

export async function fetchGovernanceRules() {
  const [riskRaw, biasRaw] = await Promise.all([
    fs.readFile(RISK_RULES_PATH, "utf8"),
    fs.readFile(BIAS_RULES_PATH, "utf8"),
  ]);

  return {
    risk_rules: JSON.parse(riskRaw),
    bias_rules: JSON.parse(biasRaw),
  };
}

export async function saveGovernanceRules(payload) {
  const writes = [];

  if (payload.risk_rules) {
    writes.push(
      fs.writeFile(
        RISK_RULES_PATH,
        `${JSON.stringify(payload.risk_rules, null, 2)}\n`,
        "utf8",
      ),
    );
  }

  if (payload.bias_rules) {
    writes.push(
      fs.writeFile(
        BIAS_RULES_PATH,
        `${JSON.stringify(payload.bias_rules, null, 2)}\n`,
        "utf8",
      ),
    );
  }

  await Promise.all(writes);

  return await fetchGovernanceRules();
}

export async function performRiskAnalysis(prompt) {
  const promptObject = await runPipeline(prompt, {
    source: "api_governance_risk",
    path: null,
    enrich: false,
  });

  const riskAnalysis = await analyzePromptRisk(promptObject);

  return {
    prompt,
    risk: riskAnalysis,
  };
}

export async function performBiasAnalysis(prompt) {
  const promptObject = await runPipeline(prompt, {
    source: "api_governance_bias",
    path: null,
    enrich: false,
  });

  const biasAnalysis = await analyzePromptBias(promptObject);

  return {
    prompt,
    bias: biasAnalysis,
  };
}
