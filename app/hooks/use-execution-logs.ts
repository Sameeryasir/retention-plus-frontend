"use client";

import { useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getExecutionLogs } from "@/app/services/automation/execution-api";
import { automationQueryKeys } from "@/app/services/automation/automation-query-keys";
import type { AutomationLog } from "@/app/services/automation/types";
import { useExecutionPusher } from "@/app/hooks/use-execution-pusher";
import { getApiErrorMessage } from "@/app/lib/toast-api-error";

export function useExecutionLogs(executionId: number | null) {
  const query = useQuery({
    queryKey:
      executionId != null
        ? automationQueryKeys.executionLogs(executionId)
        : automationQueryKeys.all,
    queryFn: async () => {
      if (executionId == null) return [] as AutomationLog[];
      return getExecutionLogs(executionId);
    },
    enabled: executionId != null,
  });

  const onTerminalRef = useRef(() => {
    void query.refetch();
  });
  onTerminalRef.current = () => {
    void query.refetch();
  };

  useExecutionPusher(executionId, useCallback(() => {
    onTerminalRef.current();
  }, []));

  return {
    logs: query.data ?? [],
    loading: query.isLoading,
    error: query.error
      ? getApiErrorMessage(query.error, "Could not load activity logs.")
      : null,
    refetch: query.refetch,
  };
}
