"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getAutomationLogs } from "@/app/services/automation/execution-api";
import type { AutomationLog } from "@/app/services/automation/types";

export function useAutomationLogs(
  automationId: number | null,
  options?: { enabled?: boolean },
) {
  const enabled = options?.enabled ?? true;
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const refetch = useCallback(async () => {
    if (!enabled || automationId == null) {
      setLogs([]);
      setLoading(false);
      return;
    }
    setError(null);
    try {
      const data = await getAutomationLogs(automationId);
      if (mountedRef.current) {
        setLogs(data);
      }
    } catch (e) {
      if (mountedRef.current) {
        setError(e instanceof Error ? e.message : "Could not load activity.");
        setLogs([]);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [automationId, enabled]);

  useEffect(() => {
    mountedRef.current = true;
    if (!enabled || automationId == null) {
      setLogs([]);
      setLoading(false);
      return () => {
        mountedRef.current = false;
      };
    }

    setLoading(true);
    setError(null);
    let cancelled = false;

    (async () => {
      try {
        const data = await getAutomationLogs(automationId);
        if (!cancelled && mountedRef.current) {
          setLogs(data);
        }
      } catch (e) {
        if (!cancelled && mountedRef.current) {
          setError(
            e instanceof Error ? e.message : "Could not load activity.",
          );
          setLogs([]);
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
  }, [automationId, enabled]);

  return { logs, loading, error, refetch };
}
