import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";

type NavItemProps = {
  to: string;
  label: string;
  icon: ReactNode;
  disabled?: boolean;
};

function NavItem({ to, label, icon, disabled = false }: NavItemProps) {
  if (disabled) {
    return (
      <div className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-zinc-600">
        <span className="text-zinc-500">{icon}</span>
        <span>{label}</span>
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 rounded-xl border px-3 py-2 text-sm transition",
          isActive
            ? "border-sky-400/30 bg-sky-500/12 text-sky-100 shadow-[0_0_24px_rgba(14,165,233,0.10)]"
            : "border-transparent text-zinc-400 hover:border-white/10 hover:bg-white/[0.03] hover:text-zinc-200",
        ].join(" ")
      }
    >
      <span>{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

function DotIcon() {
  return <span className="inline-block h-2 w-2 rounded-full bg-current" />;
}

export function SidebarNav() {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-white/10 bg-black/25 px-3 py-4 lg:block">
      <div className="mb-3 px-3 text-[10px] uppercase tracking-[0.22em] text-zinc-600">
        Workspace
      </div>

      <nav className="space-y-1">
        <NavItem to="/" label="Prompt Workspace" icon={<DotIcon />} />
        <NavItem to="/runs" label="Runs" icon={<DotIcon />} />
        <NavItem to="/library" label="Library" icon={<DotIcon />} />
        <NavItem to="/experiments" label="Experiments" icon={<DotIcon />} />
      </nav>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        <div className="text-xs font-medium text-zinc-200">Phase 30A-C</div>
        <p className="mt-2 text-xs leading-5 text-zinc-500">
          Workspace shell, prompt editor, and structured prompt inspector.
        </p>
      </div>
    </aside>
  );
}
