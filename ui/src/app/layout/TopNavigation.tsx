import { useMemo, useState } from "react";

import { useWorkspaceStore } from "../../store/workspaceStore";

function MetaPill({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "accent" | "success" | "danger";
}) {
  const toneClass =
    tone === "accent"
      ? "border-sky-500/25 bg-sky-500/10 text-sky-200"
      : tone === "success"
        ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-200"
        : tone === "danger"
          ? "border-red-500/25 bg-red-500/10 text-red-200"
          : "border-white/10 bg-white/[0.03] text-zinc-300";

  return (
    <div className={`hidden items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] lg:flex ${toneClass}`}>
      <span className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
        {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function OllamaStatus() {
  const connected = true;

  if (!connected) {
    return null;
  }

  return (
    <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-3 py-1.5 text-xs text-zinc-400 md:flex">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      <span className="text-[11px] font-medium text-zinc-300">Ollama</span>
    </div>
  );
}

export function TopNavigation() {
  const [copied, setCopied] = useState(false);
  const promptId = useWorkspaceStore((state) => state.promptId);
  const activeVariant = useWorkspaceStore((state) => state.activeVariant);
  const tokens = useWorkspaceStore((state) => state.tokens);
  const variants = useWorkspaceStore((state) => state.variants);
  const analysisStatus = useWorkspaceStore((state) => state.analysisStatus);
  const isRunning = useWorkspaceStore((state) => state.isRunning);
  const runPrompt = useWorkspaceStore((state) => state.runPrompt);

  const statusLabel = useMemo(() => {
    switch (analysisStatus) {
      case "typing":
        return "Typing";
      case "analyzing":
        return "Analyzing";
      case "parsed":
        return "Parsed";
      case "error":
        return "Error";
      default:
        return "Idle";
    }
  }, [analysisStatus]);

  const statusTone: "default" | "accent" | "success" | "danger" =
    analysisStatus === "error"
      ? "danger"
      : analysisStatus === "analyzing" || analysisStatus === "typing"
        ? "accent"
        : analysisStatus === "parsed"
          ? "success"
          : "default";

  async function handleCopy() {
    const activeText = variants[activeVariant];

    if (!activeText) {
      return;
    }

    await navigator.clipboard.writeText(activeText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1000);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1720px] items-center justify-between gap-3 px-3 md:px-5 xl:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-500/10 text-xs font-semibold text-sky-300 shadow-[0_0_24px_rgba(14,165,233,0.16)]">
            PW
          </div>

          <div className="min-w-0">
            <div className="truncate text-sm font-semibold tracking-tight text-white">
              PromptWash
            </div>
            <div className="truncate text-[11px] text-zinc-500">
              Prompt engineering workspace
            </div>
          </div>

          <div className="ml-2 hidden h-5 w-px bg-white/10 md:block" />

          <MetaPill label="Prompt ID" value={promptId} />
          <MetaPill label="Variant" value={activeVariant} />
          <MetaPill label="Tokens" value={String(tokens.input ?? 0)} />
          <MetaPill label="Status" value={statusLabel} tone={statusTone} />
        </div>

        <div className="flex items-center gap-2">
          <OllamaStatus />

          <button
            type="button"
            onClick={() => void handleCopy()}
            disabled={!variants[activeVariant]}
            className="inline-flex h-9 items-center rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copied ? "Copied" : "Copy"}
          </button>

          <button
            type="button"
            onClick={() => void runPrompt(activeVariant)}
            disabled={!variants[activeVariant] || isRunning}
            className="inline-flex h-9 items-center rounded-lg bg-sky-500 px-3 text-sm font-medium text-white shadow-[0_8px_24px_rgba(14,165,233,0.28)] transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-sky-500/50"
          >
            {isRunning ? "Running..." : "Run"}
          </button>
        </div>
      </div>
    </header>
  );
}
