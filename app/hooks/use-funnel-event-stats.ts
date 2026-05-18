"use client";

import { useEffect, useState } from "react";
import { API_MIN_LOADING_MS, delay } from "@/app/lib/api";
import { getSetupAccessToken } from "@/app/lib/setup-access-token";
import { isPositiveInt } from "@/app/lib/numbers";
import {
  getFunnelEventStats,
  type FunnelEventStats,
} from "@/app/services/funnel/get-funnel-event-stats";

export function useFunnelEventStats(funnelId: number | null | undefined) {
  const [stats, setStats] = useState<FunnelEventStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isPositiveInt(funnelId)) {
      setStats(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const token = getSetupAccessToken().trim();
    if (!token) {
      setStats(null);
      setError("Sign in to view funnel stats.");
      setIsLoading(false);
      return;
    }

    void Promise.all([
      getFunnelEventStats(token, funnelId),
      delay(API_MIN_LOADING_MS),
    ])
      .then(([data]) => {
        if (!cancelled) setStats(data);
      })
      .catch((e) => {
        if (!cancelled) {
          setStats(null);
          setError(
            e instanceof Error ? e.message : "Could not load funnel stats.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [funnelId]);

  return { stats, isLoading, error };
}
