import Editor from "@monaco-editor/react";
import { useEffect, useRef } from "react";

import { useWorkspaceStore } from "../store/workspaceStore";

const PLACEHOLDER_TITLE = "Paste a rough prompt or idea";
const PLACEHOLDER_BODY = "PromptWash will analyze and structure it automatically.";

export function RawInputPanel() {
  const debounceRef = useRef<number | null>(null);

  const rawInput = useWorkspaceStore((state) => state.rawInput);
  const normalizedPrompt = useWorkspaceStore((state) => state.normalizedPrompt);
  const analysisStatus = useWorkspaceStore((state) => state.analysisStatus);
  const errorMessage = useWorkspaceStore((state) => state.errorMessage);
  const tokens = useWorkspaceStore((state) => state.tokens);
  const setRawInput = useWorkspaceStore((state) => state.setRawInput);
  const analyzePrompt = useWorkspaceStore((state) => state.analyzePrompt);

  useEffect(() => {
    if (!rawInput.trim()) {
      void analyzePrompt("");
      return;
    }

    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      void analyzePrompt(rawInput);
    }, 450);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [rawInput, analyzePrompt]);

  const tokenCount = tokens.input ?? 0;
  const footerMessage = errorMessage
    ? errorMessage
    : analysisStatus === "analyzing"
      ? "Analyzing prompt..."
      : analysisStatus === "parsed"
        ? `Parsed successfully · ${tokenCount} tokens`
        : "Auto-analyze after typing pauses";

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-white/10 px-3 py-2.5">
        <div className="text-sm font-medium text-zinc-100">Raw Input</div>
      </div>

      <div className="min-h-0 flex-1 px-3 py-3">
        <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-[#0b0e14] transition focus-within:border-sky-400/40 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]">
          {!rawInput && (
            <div className="pointer-events-none absolute left-0 top-0 z-10 px-5 py-[18px]">
              <div className="text-[14px] leading-6 text-zinc-500">{PLACEHOLDER_TITLE}</div>
              <div className="mt-1 max-w-[30rem] text-[14px] leading-6 text-zinc-600">
                {PLACEHOLDER_BODY}
              </div>
            </div>
          )}

          <Editor
            height="100%"
            defaultLanguage="markdown"
            value={rawInput}
            onChange={(value) => setRawInput(value ?? "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineHeight: 24,
              wordWrap: "on",
              smoothScrolling: true,
              scrollBeyondLastLine: false,
              padding: { top: 18, bottom: 18 },
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace",
              renderLineHighlight: "none",
              overviewRulerBorder: false,
              hideCursorInOverviewRuler: true,
              lineNumbers: "off",
              folding: false,
              glyphMargin: false,
            }}
          />
        </div>
      </div>

      <div className="border-t border-white/10 px-3 py-2.5">
        <div className="flex items-center justify-between gap-3">
          <span
            className={[
              "text-xs",
              errorMessage
                ? "text-red-300"
                : analysisStatus === "analyzing"
                  ? "text-sky-300"
                  : analysisStatus === "parsed"
                    ? "text-emerald-300"
                    : "text-zinc-500",
            ].join(" ")}
          >
            {footerMessage}
          </span>

          <button
            type="button"
            onClick={() => void analyzePrompt(rawInput)}
            className="inline-flex h-8 items-center rounded-md border border-white/10 bg-white/[0.03] px-3 text-xs font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.06]"
          >
            Analyze
          </button>
        </div>

        {normalizedPrompt && (
          <div className="mt-2 truncate text-[11px] text-zinc-500">
            Normalized: {normalizedPrompt}
          </div>
        )}
      </div>
    </div>
  );
}
