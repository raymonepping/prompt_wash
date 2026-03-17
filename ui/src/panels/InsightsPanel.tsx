import { useWorkspaceStore } from "../store/workspaceStore";

function Card({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className={`rounded-xl border px-3 py-2 text-sm ${color}`}>
      <div className="text-[10px] uppercase tracking-widest text-zinc-500">
        {label}
      </div>

      <div className="mt-1 font-medium text-zinc-100">{value}</div>
    </div>
  );
}

export function InsightsPanel() {
  const insights = useWorkspaceStore((state) => state.insights);
  const tokens = useWorkspaceStore((state) => state.tokens);
  const analysisStatus = useWorkspaceStore((state) => state.analysisStatus);

  if (analysisStatus === "idle" || analysisStatus === "typing") {
    return <div className="p-4 text-sm text-zinc-500">Start typing to analyze.</div>;
  }

  return (
    <div className="p-3">
      <div className="grid grid-cols-1 gap-3">
      <Card
        label="Lint"
        value={insights.lint.length ? `${insights.lint.length} warnings` : "No warnings"}
        color="bg-emerald-500/10 border-emerald-500/20"
      />

      <Card
        label="Risk Score"
        value={`${insights.risk.score}`}
        color="bg-amber-500/10 border-amber-500/20"
      />

      <Card
        label="Bias Score"
        value={`${insights.bias.score}`}
        color="bg-amber-500/10 border-amber-500/20"
      />

      <Card
        label="Token Estimate"
        value={`${tokens.input ?? 0}`}
        color="bg-sky-500/10 border-sky-500/20"
      />

      <Card
        label="Complexity"
        value={insights.complexity.level}
        color="bg-teal-500/10 border-teal-500/20"
      />

      <Card
        label="Optimization"
        value={
          insights.optimization.suggestions.length
            ? `${insights.optimization.suggestions.length} suggestions`
            : "No suggestions"
        }
        color="bg-sky-500/10 border-sky-500/20"
      />
      </div>
    </div>
  );
}
