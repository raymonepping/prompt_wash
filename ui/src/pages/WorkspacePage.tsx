import { ExecutionDrawer } from "../drawers/ExecutionDrawer";
import { VariantDrawer } from "../drawers/VariantDrawer";
import { Button } from "../components/ui/Button";
import { InsightsPanel } from "../panels/InsightsPanel";
import { RawInputPanel } from "../panels/RawInputPanel";
import { StructuredPromptPanel } from "../panels/StructuredPromptPanel";
import { useWorkspaceStore } from "../store/workspaceStore";

export function WorkspacePage() {
  const runPrompt = useWorkspaceStore((state) => state.runPrompt);
  const copyPrompt = useWorkspaceStore((state) => state.copyPrompt);
  const isRunning = useWorkspaceStore((state) => state.isRunning);
  const activeVariant = useWorkspaceStore((state) => state.activeVariant);
  const copyMessage = useWorkspaceStore((state) => state.copyMessage);

  return (
    <div className="flex h-screen flex-col gap-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white/95">PromptWash Workspace</h1>
          <p className="text-sm text-white/50">
            Build, inspect, and evolve prompts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {copyMessage ? (
            <span className="text-xs text-white/55">{copyMessage}</span>
          ) : null}

          <Button onClick={() => void copyPrompt()} variant="secondary">
            Copy {activeVariant}
          </Button>

          <Button onClick={() => void runPrompt(activeVariant)} disabled={isRunning}>
            {isRunning ? "Running…" : "Run Prompt"}
          </Button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[30%_40%_30%] gap-6">
        <RawInputPanel />
        <StructuredPromptPanel />
        <InsightsPanel />
      </div>

      <div className="grid grid-rows-2 gap-6">
        <VariantDrawer />
        <ExecutionDrawer />
      </div>
    </div>
  );
}