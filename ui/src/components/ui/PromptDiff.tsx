interface PromptDiffProps {
  beforeText: string;
  afterText: string;
}

export function PromptDiff({ beforeText, afterText }: PromptDiffProps) {
  const beforeLines = beforeText.split(/\r?\n/).filter(Boolean);
  const afterLines = afterText.split(/\r?\n/).filter(Boolean);

  return (
    <div className="space-y-3">
      <div>
        <div className="mb-2 text-xs font-medium uppercase tracking-wide text-white/45">
          Before
        </div>
        <pre className="whitespace-pre-wrap rounded-xl border border-white/10 bg-black/20 p-3 font-mono text-xs text-red-200/90">
          {beforeLines.length ? beforeLines.join("\n") : "(empty)"}
        </pre>
      </div>

      <div>
        <div className="mb-2 text-xs font-medium uppercase tracking-wide text-white/45">
          After
        </div>
        <pre className="whitespace-pre-wrap rounded-xl border border-white/10 bg-black/20 p-3 font-mono text-xs text-emerald-200/90">
          {afterLines.length ? afterLines.join("\n") : "(empty)"}
        </pre>
      </div>
    </div>
  );
}