import { motion } from "framer-motion";

import { ExecutionDrawer } from "../drawers/ExecutionDrawer";
import { useWorkspace } from "../hooks/useWorkspace";
import { VariantDrawer } from "../drawers/VariantDrawer";
import { InsightsPanel } from "../panels/InsightsPanel";
import { RawInputPanel } from "../panels/RawInputPanel";
import { StructuredPromptPanel } from "../panels/StructuredPromptPanel";

type WorkspaceSectionProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
};

function WorkspaceSection({
  title,
  subtitle,
  children,
  className = "",
}: WorkspaceSectionProps) {
  return (
    <section
      className={[
        "group min-h-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/80 shadow-[0_16px_50px_rgba(0,0,0,0.42)] backdrop-blur-xl transition hover:border-white/15",
        className,
      ].join(" ")}
    >
      <div className="flex h-full min-h-0 flex-col">
        <div className="border-b border-white/10 px-3 py-3">
          <div className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
            {title}
          </div>
          <div className="mt-1 text-sm text-zinc-300">{subtitle}</div>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
      </div>
    </section>
  );
}

export default function WorkspacePage() {
  const {
    rawInput,
    normalizedPrompt,
    analysisStatus,
    isRunning,
    errorMessage,
    execution,
    clearError,
  } = useWorkspace();

  const hasPrompt = rawInput.trim().length > 0;
  const hasParsedOutput = normalizedPrompt.trim().length > 0;
  const statusTone = errorMessage
    ? "border-red-500/20 bg-red-500/10 text-red-200"
    : analysisStatus === "analyzing" || isRunning
      ? "border-sky-500/20 bg-sky-500/10 text-sky-200"
      : hasParsedOutput
        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
        : "border-white/10 bg-white/[0.03] text-zinc-300";

  const statusLabel = errorMessage
    ? errorMessage
    : isRunning
      ? "Running prompt against the backend."
      : analysisStatus === "analyzing"
        ? "Analyzing prompt with the backend parser."
        : hasParsedOutput
          ? "Workspace is synced with the latest analysis result."
          : "Enter a prompt to analyze and render variants.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="flex h-[calc(100vh-4.5rem)] min-h-[720px] flex-col gap-3"
    >
      <div className={`rounded-2xl border px-4 py-3 ${statusTone}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
              Workspace Status
            </div>
            <div className="mt-1 text-sm">{statusLabel}</div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-zinc-200">
              Input {hasPrompt ? "present" : "empty"}
            </span>
            <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-zinc-200">
              Parse {hasParsedOutput ? "ready" : "idle"}
            </span>
            <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-zinc-200">
              Run {execution ? "available" : "not run"}
            </span>

            {errorMessage && (
              <button
                type="button"
                onClick={() => clearError()}
                className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-zinc-200 transition hover:bg-black/30"
              >
                Clear Error
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 xl:grid-cols-[1.2fr_0.95fr_0.82fr]">
        <WorkspaceSection
          title="Raw Input"
          subtitle="Messy prompt input and editing surface"
        >
          <RawInputPanel />
        </WorkspaceSection>

        <WorkspaceSection
          title="Structured Prompt"
          subtitle="Canonical Prompt IR inspector"
        >
          <StructuredPromptPanel />
        </WorkspaceSection>

        <WorkspaceSection
          title="Insights"
          subtitle="Diagnostic signals and optimization hints"
        >
          <InsightsPanel />
        </WorkspaceSection>
      </div>

      <div className="grid min-h-[224px] grid-cols-1 gap-3 xl:grid-cols-[1.15fr_0.85fr]">
        <WorkspaceSection
          title="Variant Preview"
          subtitle="Rendered prompt variants for inspection and export"
        >
          <VariantDrawer />
        </WorkspaceSection>

        <WorkspaceSection
          title="Execution"
          subtitle="Run output and execution metadata"
        >
          <ExecutionDrawer />
        </WorkspaceSection>
      </div>
    </motion.div>
  );
}
