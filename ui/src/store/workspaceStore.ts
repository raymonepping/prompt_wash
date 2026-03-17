import { create } from "zustand";

import { workspaceApi } from "../api/workspaceApi";
import {
  EMPTY_INSIGHTS,
  EMPTY_PROMPT_IR,
  EMPTY_VARIANTS,
  type WorkspaceStore,
} from "../types/workspace";

function createPromptId(): string {
  return `pw_${Math.random().toString(16).slice(2, 10)}`;
}

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  rawInput: "",
  normalizedPrompt: "",
  structuredPrompt: EMPTY_PROMPT_IR,
  variants: EMPTY_VARIANTS,
  insights: EMPTY_INSIGHTS,
  tokens: {
    input: 0,
    compact: 0,
  },
  execution: null,
  metadata: {},
  activeVariant: "generic",
  analysisStatus: "idle",
  errorMessage: null,
  lastAnalyzedAt: null,
  promptId: createPromptId(),

  setRawInput: (value) => {
    const nextStatus = value.trim().length === 0 ? "idle" : "typing";

    set({
      rawInput: value,
      analysisStatus: nextStatus,
      errorMessage: null,
    });
  },

  setActiveVariant: (variant) => {
    set({ activeVariant: variant });
  },

  clearError: () => {
    set({ errorMessage: null });
  },

  analyzePrompt: async (rawInputOverride?: string) => {
    const rawInput = rawInputOverride ?? get().rawInput;

    if (!rawInput.trim()) {
      set({
        normalizedPrompt: "",
        structuredPrompt: EMPTY_PROMPT_IR,
        variants: EMPTY_VARIANTS,
        insights: EMPTY_INSIGHTS,
        tokens: { input: 0, compact: 0 },
        execution: null,
        metadata: {},
        analysisStatus: "idle",
        errorMessage: null,
      });
      return;
    }

    set({
      analysisStatus: "analyzing",
      errorMessage: null,
    });

    try {
      const response = await workspaceApi.analyzePrompt({
        raw_input: rawInput,
      });

      if (response.status !== "success") {
        throw new Error(response.error || "Unknown analyze error");
      }

      set({
        rawInput: response.data.raw_input,
        normalizedPrompt: response.data.normalized_prompt,
        structuredPrompt: response.data.structured_prompt,
        variants: response.data.variants,
        insights: response.data.insights,
        tokens: response.data.tokens,
        execution: response.data.execution,
        metadata: response.data.metadata,
        analysisStatus: "parsed",
        errorMessage: null,
        lastAnalyzedAt: new Date().toISOString(),
      });
    } catch (error) {
      set({
        analysisStatus: "error",
        errorMessage: error instanceof Error ? error.message : "Analyze failed",
      });
    }
  },
}));