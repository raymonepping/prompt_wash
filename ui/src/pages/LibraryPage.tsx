import { PageFrame, PanelCard } from "./PageFrame";

export default function LibraryPage() {
  return (
    <PageFrame
      eyebrow="Library"
      title="Prompt Library"
      description="Store canonical prompts, reusable patterns, and curated workspace artifacts without cluttering the live editing surface."
      metrics={[
        { label: "Saved Prompts", value: "0" },
        { label: "Collections", value: "0" },
        { label: "Status", value: "Scaffolded", tone: "accent" },
      ]}
      primary={
        <PanelCard
          title="Prompt Catalog"
          description="Search, filter, and revisit saved prompts once persistence is connected."
        >
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-10 text-sm text-zinc-500">
            The library is empty. Save prompts from the workspace when library persistence is implemented.
          </div>
        </PanelCard>
      }
      secondary={
        <PanelCard
          title="Planned Metadata"
          description="Library entries should remain useful for both exploration and execution."
        >
          <ul className="space-y-3 text-sm text-zinc-300">
            <li>Fingerprint, audience, output format, and tone</li>
            <li>Source prompt, normalized form, and structured IR</li>
            <li>Tags for domain, provider fit, and use case</li>
          </ul>
        </PanelCard>
      }
    />
  );
}
