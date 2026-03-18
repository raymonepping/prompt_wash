import { useWorkspaceStore } from "../store/workspaceStore";

export function ExecutionDrawer() {
  const execution = useWorkspaceStore((state) => state.execution);
  const activeVariant = useWorkspaceStore((state) => state.activeVariant);
  const variants = useWorkspaceStore((state) => state.variants);
  const isRunning = useWorkspaceStore((state) => state.isRunning);
  const runPrompt = useWorkspaceStore((state) => state.runPrompt);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-3">
        <span className="text-sm font-medium text-zinc-100">Execution Results</span>

        <button
          type="button"
          onClick={() => void runPrompt(activeVariant)}
          disabled={!variants[activeVariant] || isRunning}
          className="inline-flex h-8 items-center rounded-md bg-sky-500 px-3 text-xs font-medium text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-sky-500/50"
        >
          {isRunning ? "Running..." : `Run ${activeVariant}`}
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-3 text-sm text-zinc-300">
        {!execution && (
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-zinc-500">
            <div>No run yet.</div>
            <div className="mt-1">Execute a prompt variant to see results.</div>
          </div>
        )}

        {execution && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-sm text-zinc-300">
                Model: {execution.model}
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-sm text-zinc-300">
                Provider: {execution.provider}
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-sm text-zinc-300">
                Input Tokens: {execution.input_tokens}
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-sm text-zinc-300">
                Output Tokens: {execution.output_tokens}
              </div>
            </div>

            <pre className="rounded-xl border border-white/10 bg-[#0b0e14] p-4 font-mono text-sm text-zinc-200 whitespace-pre-wrap">
              {execution.result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
