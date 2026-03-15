import { create } from "zustand";
import { analyzeWorkspace, runWorkspace, type RunResponseData } from "../api/workspaceApi";
import type { WorkspaceStateData } from "../types/workspace";

interface WorkspaceStore {
  rawInput: string;
  data: WorkspaceStateData | null;
  previousData: WorkspaceStateData | null;
  isLoading: boolean;
  isRunning: boolean;
  error: string | null;
  runError: string | null;
  runResult: RunResponseData | null;
  activeVariant: string;
  copyMessage: string | null;
  setRawInput: (value: string) => void;
  setActiveVariant: (value: string) => void;
  analyze: (value: string) => Promise<void>;
  runPrompt: (renderMode?: string) => Promise<void>;
  copyPrompt: () => Promise<void>;
  clearCopyMessage: () => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  rawInput: "",
  data: null,
  previousData: null,
  isLoading: false,
  isRunning: false,
  error: null,
  runError: null,
  runResult: null,
  activeVariant: "generic",
  copyMessage: null,

  setRawInput: (value) => set({ rawInput: value }),
  setActiveVariant: (value) => set({ activeVariant: value }),
  clearCopyMessage: () => set({ copyMessage: null }),

  analyze: async (value) => {
    if (!value.trim()) {
      set({
        previousData: get().data,
        data: null,
        error: null,
        isLoading: false,
      });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const nextData = await analyzeWorkspace(value);
      set((state) => ({
        previousData: state.data,
        data: nextData,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },

  runPrompt: async (renderMode = "generic") => {
    const rawInput = get().rawInput;

    if (!rawInput.trim()) {
      set({ runError: "Nothing to run yet.", runResult: null });
      return;
    }

    set({ isRunning: true, runError: null });

    try {
      const result = await runWorkspace(rawInput, renderMode);
      set({
        isRunning: false,
        runError: null,
        runResult: result,
      });
    } catch (error) {
      set({
        isRunning: false,
        runError: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },

  copyPrompt: async () => {
    const { data, activeVariant } = get();
    const text = data?.variants?.[activeVariant] ?? data?.variants?.generic ?? "";

    if (!text) {
      set({ copyMessage: "Nothing to copy yet." });
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      set({ copyMessage: `Copied ${activeVariant} prompt.` });

      window.setTimeout(() => {
        get().clearCopyMessage();
      }, 1800);
    } catch {
      set({ copyMessage: "Clipboard copy failed." });

      window.setTimeout(() => {
        get().clearCopyMessage();
      }, 1800);
    }
  },
}));