"use client";

import type { ReactNode } from "react";
import { reportTableShellClass } from "@/app/lib/panel-styles";

export function ReportTable({
  header,
  children,
  footer,
  className = "",
  minWidthClass = "",
}: {
  header: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  minWidthClass?: string;
}) {
  return (
    <section
      className={`${reportTableShellClass} overflow-hidden ${className}`}
    >
      {header}
      <div className="overflow-x-auto">
        <div className={minWidthClass}>{children}</div>
      </div>
      {footer}
    </section>
  );
}
