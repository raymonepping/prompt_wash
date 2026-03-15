import {
  analyzeWorkspaceState,
  getWorkspaceSnapshot,
  runPromptFromWorkspace,
} from "../services/workspace.js";

export async function analyzeWorkspace(req, res, next) {
  try {
    const { raw_input = "", context = {} } = req.body ?? {};

    const data = await analyzeWorkspaceState({
      rawInput: raw_input,
      context,
    });

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

export async function runWorkspacePrompt(req, res, next) {
  try {
    const {
      prompt,
      model = null,
      provider = "ollama",
      render_mode = "generic",
    } = req.body ?? {};

    const data = await runPromptFromWorkspace({
      prompt,
      model,
      provider,
      renderMode: render_mode,
    });

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

export async function getWorkspaceState(_req, res, next) {
  try {
    const data = await getWorkspaceSnapshot();

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