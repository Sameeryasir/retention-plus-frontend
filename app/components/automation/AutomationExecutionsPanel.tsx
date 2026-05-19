"use client";

import { Loader2, Play } from "lucide-react";
import { useMemo, useState } from "react";
import {
  customerLabel,
  executionStatusBadgeClass,
  formatExecutionDateTime,
  formatScheduledCountdown,
} from "@/app/components/automation/execution-status-ui";
import { StartExecutionModal } from "@/app/components/automation/StartExecutionModal";
import { useAutomationExecutions } from "@/app/hooks/use-automation-executions";
import type { AutomationExecutionStatus } from "@/app/services/automation/types";

const STATUS_FILTERS: { id: "all" | AutomationExecutionStatus; label: string }[] =
  [
    { id: "all", label: "All" },
    { id: "running", label: "Running" },
    { id: "waiting", label: "Waiting" },
    { id: "completed", label: "Completed" },
    { id: "failed", label: "Failed" },
  ];

export function AutomationExecutionsPanel({
  automationId,
  automationActive,
  selectedExecutionId,
  onSelectExecution,
  onExecutionStarted,
}: {
  automationId: number;
  automationActive?: boolean;
  selectedExecutionId: number | null;
  onSelectExecution: (id: number) => void;
  onExecutionStarted: (id: number) => void;
}) {
  const [statusFilter, setStatusFilter] = useState<
    "all" | AutomationExecutionStatus
  >("all");
  const [startOpen, setStartOpen] = useState(false);

  const apiStatus =
    statusFilter === "all" ? undefined : statusFilter;

  const { executions, loading, error, refetch } = useAutomationExecutions(
    automationId,
    apiStatus,
  );

  const rows = useMemo(() => executions, [executions]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-zinc-50">
      <div className="shrink-0 border-b border-zinc-200/90 bg-white px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">Runs</h2>
            <p className="text-sm text-zinc-500">
              Customers currently in or completed in this workflow.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as typeof statusFilter)
              }
              className="h-10 cursor-pointer rounded-xl border border-zinc-200/90 bg-white px-3 text-sm font-medium text-zinc-800 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/10"
            >
              {STATUS_FILTERS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setStartOpen(true)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800"
            >
              <Play className="size-4" aria-hidden />
              Run for customer
            </button>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-zinc-500">
            <Loader2 className="size-5 animate-spin" aria-hidden />
            Loading runs…
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-8 text-center text-sm text-red-800">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-3 cursor-pointer font-semibold underline"
            >
              Try again
            </button>
          </div>
        ) : rows.length === 0 ? (
          <p className="rounded-2xl border border-zinc-200/90 bg-white px-4 py-12 text-center text-sm text-zinc-500 shadow-sm">
            No runs yet for this automation.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-sm">
            <div className="hidden grid-cols-[minmax(0,1.2fr)_0.7fr_0.8fr_0.9fr_0.9fr] gap-4 border-b border-zinc-200 bg-zinc-50/90 px-5 py-3 text-xs font-bold uppercase tracking-wide text-zinc-500 md:grid">
              <span>Customer</span>
              <span>Status</span>
              <span>Current step</span>
              <span>Started</span>
              <span>Next</span>
            </div>
            {rows.map((row) => {
              const countdown =
                row.status === "waiting"
                  ? formatScheduledCountdown(row.scheduledAt)
                  : null;
              const selected = selectedExecutionId === row.id;
              return (
                <button
                  key={row.id}
                  type="button"
                  onClick={() => onSelectExecution(row.id)}
                  className={`grid w-full cursor-pointer grid-cols-1 gap-2 border-b border-zinc-100 px-5 py-4 text-left text-sm transition last:border-0 hover:bg-zinc-50/80 md:grid-cols-[minmax(0,1.2fr)_0.7fr_0.8fr_0.9fr_0.9fr] md:items-center md:gap-4 ${
                    selected ? "bg-zinc-50 ring-1 ring-inset ring-zinc-900/10" : ""
                  }`}
                >
                  <span className="font-semibold text-zinc-900">
                    {customerLabel(row.customerId, row.customer)}
                  </span>
                  <span>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${executionStatusBadgeClass(row.status)}`}
                    >
                      {row.status}
                    </span>
                  </span>
                  <span className="text-zinc-600">
                    {row.currentNode?.type ?? "—"}
                  </span>
                  <span className="text-zinc-500">
                    {formatExecutionDateTime(row.createdAt)}
                  </span>
                  <span className="text-zinc-600">
                    {row.status === "waiting"
                      ? countdown ?? formatExecutionDateTime(row.scheduledAt)
                      : "—"}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <StartExecutionModal
        open={startOpen}
        onClose={() => setStartOpen(false)}
        automationId={automationId}
        automationActive={automationActive}
        onStarted={(id) => {
          void refetch();
          onExecutionStarted(id);
        }}
      />
    </div>
  );
}
