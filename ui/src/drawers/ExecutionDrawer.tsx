import { Panel } from "../components/ui/Panel";
import { Button } from "../components/ui/Button";
import { useWorkspaceStore } from "../store/workspaceStore";

export function ExecutionDrawer() {
  const runPrompt = useWorkspaceStore((state) => state.runPrompt);
  const isRunning = useWorkspaceStore((state) => state.isRunning);
  const runError = useWorkspaceStore((state) => state.runError);
  const runResult = useWorkspaceStore((state) => state.runResult);

  const outputText = runResult?.artifact?.output?.text ?? "";
  const evaluation = runResult?.evaluation;
  const overallScore = evaluation?.overall_score;
  const overallLevel = evaluation?.overall_level;

  return (
    <Panel
      title={
        <div className="flex items-center justify-between gap-3">
          <span>Execution Results</span>
          <Button
            onClick={() => void runPrompt("generic")}
            disabled={isRunning}
            className="px-3 py-1.5 text-xs"
          >
            {isRunning ? "Running…" : "Run Prompt"}
          </Button>
        </div>
      }
    >
      {runError && <p className="mb-3 text-sm text-red-300">{runError}</p>}

      {!runResult ? (
        <p className="text-sm text-white/50">No run yet. Press Run to execute.</p>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-white/45">
              Model Output
            </div>
            <pre className="whitespace-pre-wrap font-mono text-xs text-white/90">
              {outputText || "(no output returned)"}
            </pre>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Metric label="Overall Score" value={overallScore ?? "n/a"} />
            <Metric label="Level" value={overallLevel ?? "n/a"} />
          </div>
        </div>
      )}
    </Panel>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
      <div className="text-xs font-medium uppercase tracking-wide text-white/45">
        {label}
      </div>
      <div className="mt-1 text-white/90">{String(value)}</div>
    </div>
  );
}