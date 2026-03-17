import { motion } from "framer-motion";

import { ExecutionDrawer } from "../drawers/ExecutionDrawer";
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="flex h-[calc(100vh-4.5rem)] min-h-[720px] flex-col gap-3"
    >
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