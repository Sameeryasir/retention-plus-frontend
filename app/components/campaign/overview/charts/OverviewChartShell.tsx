"use client";

import type { ReactNode } from "react";
import { panelCardClass, panelCardPaddingClass } from "@/app/lib/panel-styles";

export function OverviewChartShell({
  title,
  subtitle,
  children,
  className = "",
  minHeightClass = "min-h-[220px]",
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  minHeightClass?: string;
}) {
  return (
    <div
      className={`flex h-full min-h-0 flex-col ${panelCardClass} ${panelCardPaddingClass} transition duration-200 hover:shadow-md ${className}`}
    >
      <div className="mb-4 shrink-0 border-b border-zinc-100 pb-4">
        <h3 className="text-sm font-semibold tracking-tight text-zinc-900">
          {title}
        </h3>
        {subtitle ? (
          <p className="mt-1 text-xs leading-relaxed text-zinc-500">{subtitle}</p>
        ) : null}
      </div>
      <div className={`flex min-h-0 flex-1 flex-col ${minHeightClass}`}>
        {children}
      </div>
    </div>
  );
}
