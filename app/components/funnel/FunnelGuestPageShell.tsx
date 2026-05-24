"use client";

import type { ReactNode } from "react";

/** Full-viewport shell for live funnel preview (opened from editor Preview). */
export function FunnelGuestPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-white">
      <main className="flex min-h-dvh w-full min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain">
        {children}
      </main>
    </div>
  );
}
