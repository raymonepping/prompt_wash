type MetricCardProps = {
  label: string;
  value: string;
  tone?: "default" | "accent" | "success";
};

function MetricCard({ label, value, tone = "default" }: MetricCardProps) {
  const toneClass =
    tone === "accent"
      ? "border-sky-500/20 bg-sky-500/10"
      : tone === "success"
        ? "border-emerald-500/20 bg-emerald-500/10"
        : "border-white/10 bg-white/[0.02]";

  return (
    <div className={`rounded-2xl border px-4 py-3 ${toneClass}`}>
      <div className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
        {label}
      </div>
      <div className="mt-2 text-lg font-semibold text-zinc-100">{value}</div>
    </div>
  );
}

type PanelCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function PanelCard({ title, description, children }: PanelCardProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-950/75 shadow-[0_18px_50px_rgba(0,0,0,0.38)] backdrop-blur-xl">
      <div className="border-b border-white/10 px-5 py-4">
        <div className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
          {title}
        </div>
        <div className="mt-1 text-sm text-zinc-300">{description}</div>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

type PageFrameProps = {
  eyebrow: string;
  title: string;
  description: string;
  metrics: MetricCardProps[];
  primary: React.ReactNode;
  secondary: React.ReactNode;
};

export function PageFrame({
  eyebrow,
  title,
  description,
  metrics,
  primary,
  secondary,
}: PageFrameProps) {
  return (
    <div className="flex h-[calc(100vh-4.5rem)] min-h-[720px] flex-col gap-4">
      <section className="rounded-3xl border border-white/10 bg-black/25 px-5 py-5 shadow-[0_18px_50px_rgba(0,0,0,0.26)] backdrop-blur-xl">
        <div className="text-[10px] uppercase tracking-[0.26em] text-zinc-500">
          {eyebrow}
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
          {description}
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {metrics.map((metric) => (
            <MetricCard
              key={metric.label}
              label={metric.label}
              value={metric.value}
              tone={metric.tone}
            />
          ))}
        </div>
      </section>

      <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="min-h-0">{primary}</div>
        <div className="min-h-0">{secondary}</div>
      </div>
    </div>
  );
}
