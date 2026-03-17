import { Outlet } from "react-router-dom";

import { SidebarNav } from "./SidebarNav";
import { TopNavigation } from "./TopNavigation";

export function AppShell() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.10),_transparent_30%),linear-gradient(180deg,_#05070b_0%,_#06080d_100%)] text-zinc-100">
      <div className="flex min-h-screen flex-col">
        <TopNavigation />

        <div className="flex min-h-0 flex-1">
          <SidebarNav />

          <main className="min-w-0 flex-1">
            <div className="h-full px-3 py-3 md:px-5 md:py-4 xl:px-6">
              <div className="mx-auto h-full max-w-[1720px]">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
