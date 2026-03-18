import { useExperiments } from "../hooks/useExperiments";
import { PageFrame, PanelCard } from "./PageFrame";

export default function ExperimentsPage() {
  const { experiments, loading, error, refresh, lastRun } = useExperiments();

  return (
    <PageFrame
      eyebrow="Experiments"
      title="Prompt Experiments"
      description="Inspect experiment artifacts from the backend and keep the comparison surface connected to the real API."
      metrics={[
        { label: "Experiments", value: String(experiments.length) },
        { label: "Variants Ready", value: "4", tone: "accent" },
        {
          label: "Status",
          value: loading ? "Loading" : error ? "Error" : "Connected",
          tone: error ? "default" : "success",
        },
      ]}
      primary={
        <PanelCard
          title="Experiment Queue"
          description="Experiment artifacts are loaded directly from `/api/experiments`."
        >
          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-10 text-sm text-zinc-500">
              Loading experiments...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-10 text-sm text-red-200">
              {error}
            </div>
          ) : experiments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-10 text-sm text-zinc-500">
              No experiments yet. Create experiment artifacts in the backend workspace to populate this page.
            </div>
          ) : (
            <div className="space-y-3">
              {experiments.map((experiment) => (
                <div
                  key={experiment}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4"
                >
                  <div className="text-sm font-medium text-zinc-100">{experiment}</div>
                  <div className="mt-1 text-xs text-zinc-500">
                    Discovered from the backend experiments directory.
                  </div>
                </div>
              ))}
            </div>
          )}
        </PanelCard>
      }
      secondary={
        <PanelCard
          title="Experiment Design"
          description="The page is API-backed now, while batch execution remains intentionally narrow until the UI adds authoring controls."
        >
          <div className="space-y-4">
            <ul className="space-y-3 text-sm text-zinc-300">
              <li>Choose variants like generic, compact, OpenAI, and Claude</li>
              <li>Compare latency, rendered prompt size, and output quality</li>
              <li>Promote winning variants into the library or workspace</li>
            </ul>

            {lastRun ? (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                {lastRun.message}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-zinc-500">
                No experiment run has been triggered from the UI yet.
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                void refresh();
              }}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300 transition hover:bg-white/[0.08]"
            >
              Refresh Experiments
            </button>
          </div>
        </PanelCard>
      }
    />
  );
}
