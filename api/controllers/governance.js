import {
  fetchGovernanceRules,
  saveGovernanceRules,
} from "../services/governance.js";

export async function getGovernanceRules(_req, res, next) {
  try {
    const data = await fetchGovernanceRules();

    res.json({
      status: "success",
      data,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateGovernanceRules(req, res, next) {
  try {
    const data = await saveGovernanceRules(req.body ?? {});

    res.json({
      status: "success",
      data,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
}