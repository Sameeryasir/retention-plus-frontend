"use client";

import { useCallback } from "react";
import { getExecutionLogs } from "@/app/services/automation/execution-api";
import type { AutomationLog } from "@/app/services/automation/types";
import { useAsyncResource } from "@/app/hooks/use-async-resource";

export function useExecutionLogs(executionId: number | null) {
  const fetcher = useCallback(async () => {
    if (executionId == null) return [] as AutomationLog[];
    return getExecutionLogs(executionId);
  }, [executionId]);

  const { data, isLoading, error, refetch } = useAsyncResource(
    executionId != null,
    fetcher,
    [executionId],
    {
      fallbackError: "Could not load activity logs.",
      resetWhenDisabled: [] as AutomationLog[],
    },
  );

  return { logs: data ?? [], loading: isLoading, error, refetch };
}
