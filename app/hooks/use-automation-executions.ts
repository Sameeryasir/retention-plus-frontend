"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getExecutions } from "@/app/services/automation/execution-api";
import type {
  AutomationExecution,
  AutomationExecutionStatus,
} from "@/app/services/automation/types";

export function useAutomationExecutions(
  automationId: number | null,
  status?: AutomationExecutionStatus,
  options?: { enabled?: boolean },
) {
  const enabled = options?.enabled ?? true;
  const [executions, setExecutions] = useState<AutomationExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const refetch = useCallback(async () => {
    if (!enabled || automationId == null) {
      setExecutions([]);
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await getExecutions({
        automationId,
        status,
      });
      if (mountedRef.current) {
        setExecutions(data);
      }
    } catch (e) {
      if (mountedRef.current) {
        setError(e instanceof Error ? e.message : "Could not load runs.");
        setExecutions([]);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [automationId, status, enabled]);

  useEffect(() => {
    mountedRef.current = true;
    if (!enabled || automationId == null) {
      setExecutions([]);
      setLoading(false);
      return () => {
        mountedRef.current = false;
      };
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const data = await getExecutions({
          automationId,
          status,
        });
        if (!cancelled && mountedRef.current) {
          setExecutions(data);
        }
      } catch (e) {
        if (!cancelled && mountedRef.current) {
          setError(e instanceof Error ? e.message : "Could not load runs.");
          setExecutions([]);
        }
      } finally {
        if (!cancelled && mountedRef.current) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      mountedRef.current = false;
    };
  }, [automationId, status, enabled]);

  return { executions, loading, error, refetch };
}
