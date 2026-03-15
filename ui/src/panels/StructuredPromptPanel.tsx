import { Panel } from "../components/ui/Panel";
import { PromptDiff } from "../components/ui/PromptDiff";
import { useWorkspaceStore } from "../store/workspaceStore";

export function StructuredPromptPanel() {
  const data = useWorkspaceStore((state) => state.data);

  const prompt = data?.structured_prompt;

  return (
    <Panel title="Structured Prompt" className="h-full">
      {!prompt ? (
        <p className="text-sm text-white/50">
          Fields will populate as you type in the Raw Input panel.
        </p>
      ) : (
        <div className="space-y-5 text-sm">
          <div className="space-y-4">
            <Field label="Goal" value={prompt.goal} />
            <Field label="Audience" value={prompt.audience} />
            <Field label="Context" value={prompt.context} />
            <Field label="Constraints" value={prompt.constraints.join(", ")} />
            <Field label="Steps" value={prompt.steps.join(" · ")} />
            <Field label="Output Format" value={prompt.output_format} />
            <Field label="Tone" value={prompt.tone} />
            <Field label="Language" value={prompt.language} />
          </div>

          <div className="border-t border-white/10 pt-4">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/55">
              Prompt Diff
            </div>
            <PromptDiff
              beforeText={data.raw_input}
              afterText={data.normalized_prompt}
            />
          </div>
        </div>
      )}
    </Panel>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
      <div className="mb-1 text-xs font-medium uppercase tracking-wide text-white/45">
        {label}
      </div>
      <div className="border-l-2 border-blue-400/30 pl-3 text-white/90">
        {value || <span className="text-white/35">Not detected</span>}
      </div>
    </div>
  );
}