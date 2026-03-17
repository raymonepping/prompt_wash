import { useState } from "react";

import { useWorkspaceStore } from "../store/workspaceStore";
import type { VariantKey } from "../types/workspace";

const variants: { key: VariantKey; label: string }[] = [
  { key: "generic", label: "Generic" },
  { key: "compact", label: "Compact" },
  { key: "openai", label: "OpenAI" },
  { key: "claude", label: "Claude" },
];

export function VariantDrawer() {
  const variantsMap = useWorkspaceStore((state) => state.variants);
  const activeVariant = useWorkspaceStore((state) => state.activeVariant);
  const setActiveVariant = useWorkspaceStore((state) => state.setActiveVariant);
  const [copied, setCopied] = useState(false);

  const text = variantsMap[activeVariant] ?? "";

  async function handleCopy() {
    if (!text) {
      return;
    }

    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1000);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-3">
        <div className="flex gap-2">
          {variants.map((variant) => (
            <button
              key={variant.key}
              type="button"
              onClick={() => setActiveVariant(variant.key)}
              className={[
                "rounded-full px-3 py-1.5 text-xs font-medium transition",
                activeVariant === variant.key
                  ? "bg-sky-500 text-white"
                  : "bg-white/5 text-zinc-300 hover:bg-white/[0.08] hover:text-zinc-100",
              ].join(" ")}
            >
              {variant.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => void handleCopy()}
          className="inline-flex h-8 items-center rounded-md border border-white/10 bg-white/[0.03] px-3 text-xs text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.06]"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-3">
        <pre className="h-full overflow-auto rounded-xl border border-white/10 bg-[#0b0e14] p-4 font-mono text-sm text-zinc-200 whitespace-pre-wrap">
          {text || "Variants will appear after analysis."}
        </pre>
      </div>
    </div>
  );
}
