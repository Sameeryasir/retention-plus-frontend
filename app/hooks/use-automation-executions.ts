"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  deleteExecution as deleteExecutionApi,
  getExecutions,
} from "@/app/services/automation/execution-api";
import {
  EXECUTIONS_PAGE_SIZE,
  type AutomationExecution,
  type AutomationExecutionStatus,
  type ExecutionListSummary,
  type PaginationMeta,
} from "@/app/services/automation/types";

export function useAutomationExecutions(
  automationId: number | null,
  status?: AutomationExecutionStatus,
  options?: { enabled?: boolean },
) {
  const enabled = options?.enabled ?? true;
  const [executions, setExecutions] = useState<AutomationExecution[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [summary, setSummary] = useState<ExecutionListSummary | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const mountedRef = useRef(true);

  const fetchPage = useCallback(
    async (targetPage: number) => {
      if (!enabled || automationId == null) {
        setExecutions([]);
        setMeta(null);
        setSummary(null);
        setLoading(false);
        return;
      }

      setError(null);
      setLoading(true);

      try {
        const response = await getExecutions({
          automationId,
          status,
          page: targetPage,
          limit: EXECUTIONS_PAGE_SIZE,
        });
        if (!mountedRef.current) return;

        setExecutions(response.data);
        setMeta(response.meta);
        setSummary(response.meta.summary ?? null);
        setPage(response.meta.page);
      } catch (e) {
        if (!mountedRef.current) return;
        setError(e instanceof Error ? e.message : "Could not load runs.");
        setExecutions([]);
        setMeta(null);
        setSummary(null);
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [automationId, status, enabled],
  );

  const refetch = useCallback(async () => {
    await fetchPage(page);
  }, [fetchPage, page]);

  const goToPage = useCallback(
    (nextPage: number) => {
      void fetchPage(nextPage);
    },
    [fetchPage],
  );

  /** DELETE /automation/execution/:id — refreshes the current list after delete. */
  const deleteExecution = useCallback(
    async (executionId: number): Promise<void> => {
      setDeletingId(executionId);
      try {
        await deleteExecutionApi(executionId);
        if (!mountedRef.current) return;

        const isLastOnPage = executions.length === 1;
        const previousPage = page;
        if (isLastOnPage && previousPage > 1) {
          await fetchPage(previousPage - 1);
        } else {
          await fetchPage(previousPage);
        }
      } finally {
        if (mountedRef.current) {
          setDeletingId(null);
        }
      }
    },
    [executions.length, page, fetchPage],
  );

  useEffect(() => {
    mountedRef.current = true;
    void fetchPage(1);
    return () => {
      mountedRef.current = false;
    };
  }, [automationId, status, enabled, fetchPage]);

  return {
    executions,
    meta,
    summary,
    page,
    setPage: goToPage,
    loading,
    error,
    refetch,
    deleteExecution,
    deletingId,
  };
}
