"use client";

import { ArrowLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  executionRecipientsFromLogs,
  executionRunSubtitle,
  executionRunTitle,
  executionStatusBadgeClass,
  formatExecutionDateTime,
  formatScheduledCountdown,
  recipientLabel,
} from "@/app/components/automation/execution-status-ui";
import { useExecutionDetail } from "@/app/hooks/use-execution-detail";
import { isAdminUser } from "@/app/lib/is-admin-user";
import { AutomationApiError } from "@/app/services/automation/automation-fetch";
import {
  processExecution,
  resumeExecution,
} from "@/app/services/automation/execution-api";

function funnelQuery(funnelId?: number | null): string {
  if (funnelId == null || funnelId < 1) return "";
  return `&funnelId=${encodeURIComponent(String(funnelId))}`;
}

export function AutomationRunDetailPage({
  restaurantId,
  automationId,
  automationName,
  executionId,
  funnelId,
}: {
  restaurantId: number;
  automationId: string;
  automationName?: string;
  executionId: number;
  funnelId?: number | null;
}) {
  const { execution, logs, loading, error, refetch } =
    useExecutionDetail(executionId);
  const [actionLoading, setActionLoading] = useState(false);
  const isAdmin = isAdminUser();

  const runsHref = `/restaurant/${restaurantId}/dashboard/automations/${automationId}?tab=runs${funnelQuery(funnelId)}`;
  const automationHref = `/restaurant/${restaurantId}/dashboard/automations/${automationId}${funnelId != null && funnelId >= 1 ? `?funnelId=${funnelId}` : ""}`;

  const executedRecipients =
    execution?.executedRecipients?.length
      ? execution.executedRecipients
      : executionRecipientsFromLogs(logs);
  const recipientSubtitle = executionRunSubtitle(executedRecipients);

  async function runAdminAction(
    fn: () => Promise<void>,
    successMessage: string,
  ) {
    setActionLoading(true);
    try {
      await fn();
      toast.success(successMessage);
      await new Promise((r) => setTimeout(r, 500));
      await refetch();
    } catch (err) {
      if (err instanceof AutomationApiError && err.status === 403) {
        toast.error("Admin permission required.");
      } else {
        toast.error(
          err instanceof Error ? err.message : "Action failed.",
        );
      }
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col overflow-hidden bg-zinc-50">
      <header className="shrink-0 border-b border-zinc-200/90 bg-white px-4 py-4 sm:px-6">
        <nav
          className="flex flex-wrap items-center gap-1 text-xs font-medium text-zinc-500"
          aria-label="Breadcrumb"
        >
          <Link href={runsHref} className="transition hover:text-zinc-900">
            Runs
          </Link>
          <ChevronRight className="size-3.5 shrink-0" aria-hidden />
          <span className="font-semibold text-zinc-900">
            Run #{executionId}
          </span>
        </nav>

        <Link
          href={runsHref}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-600 hover:text-zinc-900"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to runs
        </Link>

        {loading && !execution ? (
          <div className="mt-4 flex items-center gap-2 text-sm text-zinc-500">
            <Loader2 className="size-5 animate-spin" aria-hidden />
            Loading run details…
          </div>
        ) : error ? (
          <p className="mt-4 text-sm text-red-700">{error}</p>
        ) : execution ? (
          <div className="mt-4">
            <h1 className="text-xl font-bold text-zinc-900">
              {executionRunTitle(
                executedRecipients,
                execution.customerId,
                execution.customer,
              )}
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              {automationName ??
                execution.automation?.name ??
                `Automation #${execution.automationId}`}
            </p>
            {recipientSubtitle ? (
              <p className="mt-1 text-sm text-zinc-600">{recipientSubtitle}</p>
            ) : null}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${executionStatusBadgeClass(execution.status)}`}
              >
                {execution.status}
              </span>
              <span className="text-xs text-zinc-500">
                Started {formatExecutionDateTime(execution.createdAt)}
              </span>
              {execution.status === "waiting" &&
              formatScheduledCountdown(execution.scheduledAt) ? (
                <span className="text-xs font-medium text-amber-800">
                  {formatScheduledCountdown(execution.scheduledAt)}
                </span>
              ) : null}
            </div>
          </div>
        ) : null}
      </header>

      {execution ? (
        <div className="shrink-0 border-b border-zinc-200/90 bg-white px-4 py-3 text-sm text-zinc-600 sm:px-6">
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            <p>
              <span className="font-semibold text-zinc-700">Step:</span>{" "}
              {execution.currentNode?.type ?? "—"}
            </p>
            <p>
              <span className="font-semibold text-zinc-700">Run ID:</span> #
              {execution.id}
            </p>
            <Link
              href={automationHref}
              className="font-semibold text-violet-700 hover:text-violet-900"
            >
              View automation flow
            </Link>
          </div>
        </div>
      ) : null}

      {isAdmin && execution ? (
        <div className="flex shrink-0 flex-wrap gap-2 border-b border-zinc-100 bg-white px-4 py-3 sm:px-6">
          {execution.status === "failed" ? (
            <button
              type="button"
              disabled={actionLoading}
              onClick={() =>
                void runAdminAction(
                  () => processExecution(execution.id),
                  "Retry queued.",
                )
              }
              className="cursor-pointer rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
            >
              Retry
            </button>
          ) : null}
          {execution.status === "waiting" ? (
            <button
              type="button"
              disabled={actionLoading}
              onClick={() =>
                void runAdminAction(
                  () => resumeExecution(execution.id),
                  "Resume queued.",
                )
              }
              className="cursor-pointer rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 disabled:opacity-50"
            >
              Resume now
            </button>
          ) : null}
          <button
            type="button"
            disabled={actionLoading}
            onClick={() =>
              void runAdminAction(
                () => processExecution(execution.id),
                "Re-process queued.",
              )
            }
            className="cursor-pointer rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 disabled:opacity-50"
          >
            Re-process
          </button>
        </div>
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-3xl">
          {execution?.status === "completed" && executedRecipients.length > 0 ? (
            <div className="mb-6 rounded-xl border border-emerald-200/90 bg-emerald-50/80 px-4 py-4">
              <h2 className="text-xs font-bold uppercase tracking-wide text-emerald-900">
                Executed for ({executedRecipients.length})
              </h2>
              <ul className="mt-3 space-y-2">
                {executedRecipients.map((recipient) => (
                  <li
                    key={recipient.customerId}
                    className="text-sm font-medium text-emerald-950"
                  >
                    {recipientLabel(recipient)}
                    <span className="ml-1 text-xs font-normal text-emerald-800">
                      #{recipient.customerId}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <h2 className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Timeline
          </h2>
          {loading && logs.length === 0 ? (
            <p className="mt-4 flex items-center gap-2 text-sm text-zinc-500">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Loading logs…
            </p>
          ) : logs.length === 0 ? (
            <p className="mt-4 rounded-xl border border-zinc-200/90 bg-white px-4 py-8 text-center text-sm text-zinc-500">
              No log entries for this run yet.
            </p>
          ) : (
            <ol className="relative mt-4 space-y-0 rounded-xl border border-zinc-200/90 bg-white p-4 shadow-sm">
              {logs.map((log, index) => (
                <li
                  key={log.id}
                  className={`relative border-l border-zinc-200 pl-5 ${index < logs.length - 1 ? "pb-6" : ""}`}
                >
                  <span
                    className="absolute -left-[0.35rem] top-1 size-2.5 rounded-full bg-violet-400 ring-4 ring-white"
                    aria-hidden
                  />
                  <p className="text-xs font-semibold text-zinc-500">
                    {formatExecutionDateTime(log.createdAt)}
                  </p>
                  {log.node?.type ? (
                    <span className="mt-1 inline-flex rounded-md bg-zinc-100 px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-zinc-600">
                      {log.node.type}
                    </span>
                  ) : null}
                  <p className="mt-1.5 text-sm text-zinc-800">{log.message}</p>
                  {log.error ? (
                    <p className="mt-1 text-sm font-medium text-red-600">
                      {log.error}
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
