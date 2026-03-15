
import { useEffect } from "react";
import { Panel } from "../components/ui/Panel";
import { useWorkspaceStore } from "../store/workspaceStore";

export function RawInputPanel() {
  const rawInput = useWorkspaceStore((state) => state.rawInput);
  const setRawInput = useWorkspaceStore((state) => state.setRawInput);
  const analyze = useWorkspaceStore((state) => state.analyze);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void analyze(rawInput);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [rawInput, analyze]);

  return (
    <Panel title="Raw Input" className="h-full">
      <textarea
        value={rawInput}
        onChange={(event) => setRawInput(event.target.value)}
        placeholder="Paste a rough idea, request, or messy prompt. PromptWash will structure it live."
        className="h-full min-h-[320px] w-full resize-none rounded-xl border border-white/10 bg-black/20 p-4 font-mono text-base leading-7 text-white/90 outline-none placeholder:text-white/35"
      />
    </Panel>
  );
}