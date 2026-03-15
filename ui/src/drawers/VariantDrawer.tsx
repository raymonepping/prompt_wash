import { Panel } from "../components/ui/Panel";
import { Button } from "../components/ui/Button";
import { useWorkspaceStore } from "../store/workspaceStore";

const VARIANTS = ["generic", "compact", "openai", "claude"] as const;

export function VariantDrawer() {
  const data = useWorkspaceStore((state) => state.data);
  const activeVariant = useWorkspaceStore((state) => state.activeVariant);
  const setActiveVariant = useWorkspaceStore((state) => state.setActiveVariant);
  const copyPrompt = useWorkspaceStore((state) => state.copyPrompt);
  const copyMessage = useWorkspaceStore((state) => state.copyMessage);

  const variantText =
    data?.variants?.[activeVariant] ?? data?.variants?.generic ?? "";

  return (
    <Panel
      title={
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>Variant Preview</span>
            <div className="ml-3 flex items-center gap-1">
              {VARIANTS.map((variant) => (
                <button
                  key={variant}
                  type="button"
                  onClick={() => setActiveVariant(variant)}
                  className={[
                    "rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition",
                    activeVariant === variant
                      ? "bg-blue-500/20 text-white border border-blue-400/30"
                      : "bg-white/5 text-white/65 border border-white/10 hover:bg-white/10",
                  ].join(" ")}
                >
                  {variant}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {copyMessage ? (
              <span className="text-xs text-white/55">{copyMessage}</span>
            ) : null}
            <Button onClick={() => void copyPrompt()} variant="secondary" className="px-3 py-1.5 text-xs">
              Copy
            </Button>
          </div>
        </div>
      }
    >
      {!data ? (
        <p className="text-sm text-white/50">Variants will appear after analysis.</p>
      ) : (
        <pre className="overflow-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-black/20 p-4 font-mono text-xs text-white/85">
          {variantText}
        </pre>
      )}
    </Panel>
  );
}