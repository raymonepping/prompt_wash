
import type { PropsWithChildren, ReactNode } from "react";
import clsx from "clsx";

interface PanelProps extends PropsWithChildren {
  title: ReactNode;
  className?: string;
}

export function Panel({ title, className, children }: PanelProps) {
  return (
    <section
      className={clsx(
        "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl",
        "flex min-h-0 flex-col overflow-hidden",
        className,
      )}
    >
      <header className="border-b border-white/10 px-4 py-3 text-sm font-semibold text-white/90">
        {title}
      </header>
      <div className="min-h-0 flex-1 overflow-auto p-4">{children}</div>
    </section>
  );
}