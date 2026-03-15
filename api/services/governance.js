import fs from "node:fs/promises";
import path from "node:path";

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