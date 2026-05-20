"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getExecutionById,
  getExecutionLogs,
} from "@/app/services/automation/execution-api";
import type {
  AutomationExecution,
  AutomationLog,
} from "@/app/services/automation/types";

export function useExecutionDetail(
  executionId: number | null,
  options?: { enabled?: boolean },
) {
  const enabled = options?.enabled ?? true;
  const [execution, setExecution] = useState<AutomationExecution | null>(null);
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const refetch = useCallback(async () => {
    if (!enabled || executionId == null) {
      setExecution(null);
      setLogs([]);
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const [ex, logList] = await Promise.all([
        getExecutionById(executionId),
        getExecutionLogs(executionId),
      ]);
      if (mountedRef.current) {
        setExecution(ex);
        setLogs(logList);
      }
    } catch (e) {
      if (mountedRef.current) {
        setError(e instanceof Error ? e.message : "Could not load run.");
        setExecution(null);
        setLogs([]);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [executionId, enabled]);

  useEffect(() => {
    mountedRef.current = true;
    if (!enabled || executionId == null) {
      setExecution(null);
      setLogs([]);
      setLoading(false);
      return () => {
        mountedRef.current = false;
      };
    }

    void refetch();

    return () => {
      mountedRef.current = false;
    };
  }, [executionId, enabled, refetch]);

  return { execution, logs, loading, error, refetch };
}
