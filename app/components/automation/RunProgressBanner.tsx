"use client";

import { motion } from "framer-motion";
import { CheckCircle2, CircleDot, Loader2 } from "lucide-react";
import { automationEase } from "@/app/lib/motion";
import {
  isBulkEmailSendInProgress,
  normalizeExecutionStatusForDisplay,
} from "@/app/components/automation/execution-status-ui";
import { executionStatusBadgeClass } from "@/app/lib/badge-variants";
import type { AutomationExecutionStatusDto } from "@/app/services/automation/types";

const ICON_STROKE = 2.25;

export function RunProgressBanner({
  status: rawStatus,
}: {
  status: AutomationExecutionStatusDto;
}) {
  const status = normalizeExecutionStatusForDisplay(rawStatus);
  const bulkSending = isBulkEmailSendInProgress(status);
  const isDone = status.status === "completed";
  const isFailed = status.status === "failed";
  const percent = Math.min(100, Math.max(0, status.progressPercent));
  const hasTotal = status.totalRecipients > 0;
  const showPercent = hasTotal && !bulkSending;

  const title = isDone
    ? "Emails sent"
    : isFailed
      ? "Run failed"
      : status.status === "queued"
        ? "Queued"
        : status.status === "running"
          ? "Sending emails"
          : status.status === "waiting"
            ? "Waiting"
            : "In progress";

  const detail = isDone
    ? hasTotal
      ? `${status.emailsSent} of ${status.totalRecipients} sent`
      : "Run completed successfully."
    : isFailed
      ? (status.lastError ?? "Something went wrong. Try again.")
      : status.status === "queued"
        ? "Your run will start in a moment."
        : bulkSending
          ? `Sending ${status.totalRecipients} email${status.totalRecipients === 1 ? "" : "s"}…`
          : status.status === "running" && hasTotal
            ? `${status.emailsSent} of ${status.totalRecipients} sent`
            : status.status === "waiting"
              ? "Paused until the next step is due."
              : "Working through this run…";

  const barTone = isDone
    ? "from-emerald-500 to-emerald-600"
    : isFailed
      ? "from-red-500 to-red-600"
      : "from-violet-600 to-indigo-500";

  const iconWrapClass = isDone
    ? "bg-emerald-600 shadow-emerald-500/25"
    : isFailed
      ? "bg-red-600 shadow-red-500/25"
      : "bg-violet-600 shadow-violet-500/25";

  return (
    <div
      className={`mb-5 overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ${
        isDone
          ? "border-emerald-200/80 ring-emerald-100/80"
          : isFailed
            ? "border-red-200/80 ring-red-100/80"
            : "border-violet-200/80 ring-violet-100/80"
      }`}
      role="status"
      aria-live="polite"
    >
      <div
        className={`px-5 py-4 ${
          isDone
            ? "bg-gradient-to-r from-emerald-600/10 via-emerald-50/90 to-emerald-50/50"
            : isFailed
              ? "bg-gradient-to-r from-red-600/10 via-red-50/90 to-red-50/50"
              : "bg-gradient-to-r from-violet-600/10 via-indigo-50/90 to-violet-50/50"
        }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <span
              className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-white shadow-md ${iconWrapClass}`}
            >
              {isDone ? (
                <CheckCircle2
                  className="size-5"
                  aria-hidden
                  strokeWidth={ICON_STROKE}
                />
              ) : status.status === "queued" || status.status === "running" ? (
                <Loader2
                  className="size-5 animate-spin"
                  aria-hidden
                  strokeWidth={ICON_STROKE}
                />
              ) : (
                <CircleDot
                  className="size-5"
                  aria-hidden
                  strokeWidth={ICON_STROKE}
                />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-bold text-zinc-900">{title}</p>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${executionStatusBadgeClass(status.status)}`}
                >
                  {status.status}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-zinc-600">{detail}</p>
            </div>
          </div>
          {showPercent ? (
            <p
              className={`shrink-0 text-right text-2xl font-bold tabular-nums ${
                isDone
                  ? "text-emerald-700"
                  : isFailed
                    ? "text-red-700"
                    : "text-violet-700"
              }`}
            >
              {percent}
              <span
                className={`text-sm font-semibold ${
                  isDone
                    ? "text-emerald-500"
                    : isFailed
                      ? "text-red-500"
                      : "text-violet-500"
                }`}
              >
                %
              </span>
            </p>
          ) : bulkSending ? (
            <p className="shrink-0 text-right text-sm font-semibold text-violet-600">
              In progress…
            </p>
          ) : null}
        </div>

        {hasTotal && !bulkSending ? (
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold text-zinc-500">
              <span>Progress</span>
              <span className="tabular-nums text-zinc-700">
                {status.emailsSent} / {status.totalRecipients}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-zinc-200/80">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${barTone}`}
                initial={false}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.45, ease: automationEase }}
              />
            </div>
          </div>
        ) : bulkSending ? (
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold text-zinc-500">
              <span>Progress</span>
              <span className="text-violet-600">Bulk send</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-zinc-200/80">
              <motion.div
                className={`h-full w-full rounded-full bg-gradient-to-r ${barTone}`}
                animate={{ opacity: [0.55, 0.95, 0.55] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
