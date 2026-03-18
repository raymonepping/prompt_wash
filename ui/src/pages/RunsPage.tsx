import { useRuns } from "../hooks/useRuns";
import { PageFrame, PanelCard } from "./PageFrame";

function formatBoolean(value: boolean | null): string {
  if (value === null) {
    return "Unknown";
  }

  return value ? "Success" : "Failed";
}

function formatDate(value: string | null): string {
  if (!value) {
    return "Unknown";
  }

  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
}

export default function RunsPage() {
  const { runs, loading, error, refresh } = useRuns();
  const latestProvider = runs[0]?.provider ?? "None";
  const latestModel = runs[0]?.model ?? "None";
  const successfulRuns = runs.filter((run) => run.success === true).length;

  return (
    <PageFrame
      eyebrow="Runs"
      title="Execution Runs"
      description="Inspect recent executions, review rendered prompts, and compare output quality from saved PromptWash run artifacts."
      metrics={[
        { label: "Saved Runs", value: String(runs.length) },
        { label: "Latest Provider", value: latestProvider, tone: "accent" },
        {
          label: "Latest Model",
          value: latestModel,
          tone: loading ? "default" : "success",
        },
        {
          label: "Status",
          value: loading ? "Loading" : error ? "Error" : "Synced",
          tone: error ? "default" : "success",
        },
        { label: "Successful", value: String(successfulRuns) },
      ]}
      primary={
        <PanelCard
          title="Recent Runs"
          description="Saved execution artifacts are listed newest first."
        >
          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-10 text-sm text-zinc-500">
              Loading runs...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-10 text-sm text-red-200">
              {error}
            </div>
          ) : runs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-10 text-sm text-zinc-500">
              No saved runs yet. Execute prompts from the workspace to populate this page.
            </div>
          ) : (
            <div className="space-y-3">
              {runs.map((run) => (
                <div
                  key={run.run_id}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-zinc-100">{run.run_id}</div>
                      <div className="mt-1 text-xs text-zinc-500">
                        {formatDate(run.created_at)}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-zinc-300">
                        {run.provider ?? "unknown provider"}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-zinc-300">
                        {run.model ?? "unknown model"}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-zinc-300">
                        {run.render_mode ?? "unknown mode"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                      <div className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                        Latency
                      </div>
                      <div className="mt-1 text-sm text-zinc-200">
                        {run.latency_ms != null ? `${run.latency_ms} ms` : "N/A"}
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                      <div className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                        Fingerprint
                      </div>
                      <div className="mt-1 text-sm text-zinc-200">
                        {run.fingerprint ?? "N/A"}
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                      <div className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                        Result
                      </div>
                      <div className="mt-1 text-sm text-zinc-200">
                        {formatBoolean(run.success)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                      <div className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                        Intent
                      </div>
                      <div className="mt-1 text-sm text-zinc-200">
                        {run.intent || "N/A"}
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                      <div className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                        Source
                      </div>
                      <div className="mt-1 text-sm text-zinc-200">
                        {run.source_type ?? "unknown"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </PanelCard>
      }
      secondary={
        <PanelCard
          title="Runs Surface"
          description="This page now reads from the real `/api/runs` endpoint and stays aligned with execution storage."
        >
          <div className="space-y-4">
            <ul className="space-y-3 text-sm text-zinc-300">
              <li>Run IDs and timestamps from persisted execution artifacts</li>
              <li>Provider, model, render mode, fingerprint, and source metadata</li>
              <li>Ready for drill-down via the existing `fetchRunById` and `useRun` hook</li>
            </ul>

            <button
              type="button"
              onClick={() => {
                void refresh();
              }}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300 transition hover:bg-white/[0.08]"
            >
              Refresh Runs
            </button>
          </div>
        </PanelCard>
      }
    />
  );
}
