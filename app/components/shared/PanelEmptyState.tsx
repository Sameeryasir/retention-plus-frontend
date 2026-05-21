"use client";

import type { LucideIcon } from "lucide-react";
import { panelCardClass } from "@/app/lib/panel-styles";

export function PanelEmptyState({
  icon: Icon,
  title,
  description,
  iconClassName = "bg-violet-100 text-violet-600",
  className = "",
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  iconClassName?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center px-6 py-16 text-center ${panelCardClass} ${className}`}
    >
      <span
        className={`flex size-14 items-center justify-center rounded-2xl ${iconClassName}`}
      >
        <Icon className="size-7" aria-hidden strokeWidth={2.25} />
      </span>
      <p className="mt-4 text-sm font-semibold text-zinc-900">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-zinc-500">{description}</p>
    </div>
  );
}
