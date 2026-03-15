import { Panel } from "../components/ui/Panel";
import { useWorkspaceStore } from "../store/workspaceStore";

export function InsightsPanel() {
  const data = useWorkspaceStore((state) => state.data);
  const isLoading = useWorkspaceStore((state) => state.isLoading);
  const error = useWorkspaceStore((state) => state.error);

  return (
    <Panel title="Insights" className="h-full">
      {isLoading && <p className="text-sm text-white/50">Analyzing…</p>}
      {error && <p className="text-sm text-red-300">{error}</p>}

      {!data && !isLoading && !error ? (
        <p className="text-sm text-white/50">Start typing to see analysis.</p>
      ) : data ? (
        <div className="space-y-3 text-sm">
          <Card title="Lint" value={`${data.lint.length} warning(s)`} />
          <Card
            title="Risk Score"
            value={
              typeof data.risk === "object" && data.risk && "risk_level" in data.risk
                ? String((data.risk as { risk_level: string }).risk_level)
                : "n/a"
            }
          />
          <Card
            title="Bias Score"
            value={
              typeof data.bias === "object" && data.bias && "bias_level" in data.bias
                ? String((data.bias as { bias_level: string }).bias_level)
                : "n/a"
            }
          />
          <Card
            title="Token Estimate"
            value={
              typeof data.tokens === "object" && data.tokens && "input" in data.tokens
                ? String((data.tokens as { input: number }).input)
                : "n/a"
            }
          />
          <Card
            title="Complexity"
            value={
              typeof data.complexity === "object" && data.complexity && "score" in data.complexity
                ? String((data.complexity as { score: number }).score)
                : "n/a"
            }
          />
        </div>
      ) : null}
    </Panel>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
      <div className="text-xs font-medium uppercase tracking-wide text-white/45">
        {title}
      </div>
      <div className="mt-1 text-white/90">{value}</div>
    </div>
  );
}