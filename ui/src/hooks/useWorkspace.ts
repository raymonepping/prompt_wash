import { useWorkspaceStore } from "../store/workspaceStore";

export function useWorkspace() {
  const rawInput = useWorkspaceStore((state) => state.rawInput);
  const normalizedPrompt = useWorkspaceStore((state) => state.normalizedPrompt);
  const structuredPrompt = useWorkspaceStore((state) => state.structuredPrompt);
  const variants = useWorkspaceStore((state) => state.variants);
  const insights = useWorkspaceStore((state) => state.insights);
  const tokens = useWorkspaceStore((state) => state.tokens);
  const execution = useWorkspaceStore((state) => state.execution);
  const metadata = useWorkspaceStore((state) => state.metadata);
  const activeVariant = useWorkspaceStore((state) => state.activeVariant);
  const analysisStatus = useWorkspaceStore((state) => state.analysisStatus);
  const isRunning = useWorkspaceStore((state) => state.isRunning);
  const errorMessage = useWorkspaceStore((state) => state.errorMessage);
  const lastAnalyzedAt = useWorkspaceStore((state) => state.lastAnalyzedAt);
  const promptId = useWorkspaceStore((state) => state.promptId);
  const setRawInput = useWorkspaceStore((state) => state.setRawInput);
  const setActiveVariant = useWorkspaceStore((state) => state.setActiveVariant);
  const analyzePrompt = useWorkspaceStore((state) => state.analyzePrompt);
  const runPrompt = useWorkspaceStore((state) => state.runPrompt);
  const clearError = useWorkspaceStore((state) => state.clearError);

  return {
    rawInput,
    normalizedPrompt,
    structuredPrompt,
    variants,
    insights,
    tokens,
    execution,
    metadata,
    activeVariant,
    analysisStatus,
    isRunning,
    errorMessage,
    lastAnalyzedAt,
    promptId,
    setRawInput,
    setActiveVariant,
    analyzePrompt,
    runPrompt,
    clearError,
  };
}
