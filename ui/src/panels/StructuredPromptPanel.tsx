import { useWorkspaceStore } from "../store/workspaceStore";

function Field({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2">
      <div className="text-[10px] uppercase tracking-widest text-zinc-500">
        {label}
      </div>

      <div className="mt-1 text-sm text-zinc-200">
        {String(value ?? "").trim() ? value : <span className="text-zinc-500">Not detected</span>}
      </div>
    </div>
  );
}

function ListField({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2">
      <div className="text-[10px] uppercase tracking-widest text-zinc-500">
        {label}
      </div>

      {items.length > 0 ? (
        <ul className="mt-2 space-y-1.5">
          {items.map((item, index) => (
            <li key={`${label}-${index}`} className="text-sm text-zinc-200">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-1 text-sm text-zinc-500">Not detected</div>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="px-1 text-[10px] uppercase tracking-[0.24em] text-zinc-600">
        {title}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

export function StructuredPromptPanel() {
  const prompt = useWorkspaceStore((state) => state.structuredPrompt);
  const tokens = useWorkspaceStore((state) => state.tokens);

  const hasStructure =
    Boolean(prompt.goal) ||
    Boolean(prompt.audience) ||
    Boolean(prompt.context) ||
    prompt.constraints.length > 0 ||
    prompt.steps.length > 0 ||
    Boolean(prompt.output_format) ||
    Boolean(prompt.tone) ||
    Boolean(prompt.language);

  if (!hasStructure) {
    return (
      <div className="p-4 text-sm text-zinc-500">
        Fields will populate as the prompt is analyzed.
      </div>
    );
  }

  return (
    <div className="panel-scrollbar h-full overflow-y-auto p-3 pr-1">
      <div className="space-y-4">
        <Section title="Core">
          <Field label="Goal" value={prompt.goal} />
          <Field label="Audience" value={prompt.audience} />
          <Field label="Context" value={prompt.context} />
        </Section>

        <Section title="Instructions">
          <ListField label="Constraints" items={prompt.constraints} />
          <ListField label="Steps" items={prompt.steps} />
        </Section>

        <Section title="Output">
          <Field label="Output Format" value={prompt.output_format} />
          <Field label="Tone" value={prompt.tone} />
          <Field label="Language" value={prompt.language} />
          <Field label="Tokens" value={tokens.input} />
        </Section>
      </div>
    </div>
  );
}
