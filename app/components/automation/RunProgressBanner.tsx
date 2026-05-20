"use client";

import { Loader2 } from "lucide-react";
import type { AutomationExecutionStatusDto } from "@/app/services/automation/types";
import { executionStatusBadgeClass } from "@/app/components/automation/execution-status-ui";

export function RunProgressBanner({
  status,
}: {
  status: AutomationExecutionStatusDto;
}) {
  const label =
    status.status === "queued"
      ? "Queued — starting soon…"
      : status.status === "running"
        ? `Sending emails… ${status.emailsSent} of ${status.totalRecipients}`
        : status.status === "waiting"
          ? "Waiting for next step…"
          : "Processing…";

  return (
    <div
      className="mb-4 rounded-xl border border-violet-200/90 bg-gradient-to-r from-violet-50 to-indigo-50 px-4 py-3 shadow-sm ring-1 ring-violet-100"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-wrap items-center gap-3">
        <Loader2
          className="size-5 shrink-0 animate-spin text-violet-600"
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-zinc-900">{label}</p>
          {status.totalRecipients > 0 ? (
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/80 ring-1 ring-violet-200/60">
              <div
                className="h-full rounded-full bg-violet-600 transition-[width] duration-500 ease-out"
                style={{ width: `${status.progressPercent}%` }}
              />
            </div>
          ) : null}
        </div>
        <span
          className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${executionStatusBadgeClass(status.status)}`}
        >
          {status.status}
        </span>
      </div>
    </div>
  );
}
