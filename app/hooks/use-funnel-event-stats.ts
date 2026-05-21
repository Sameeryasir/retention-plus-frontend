"use client";

import { useCallback } from "react";
import { useTokenGatedResource } from "@/app/hooks/use-token-gated-resource";
import { getSetupAccessToken } from "@/app/lib/setup-access-token";
import {
  getFunnelEventStats,
  type FunnelEventStats,
} from "@/app/services/funnel/get-funnel-event-stats";

export function useFunnelEventStats(funnelId: number | null | undefined) {
  const token = getSetupAccessToken().trim();

  const fetch = useCallback(
    (authToken: string, id: number) => getFunnelEventStats(authToken, id),
    [],
  );

  const { data, isLoading, error } = useTokenGatedResource<FunnelEventStats>({
    resourceId: funnelId,
    token,
    fetch,
    noTokenError: "Sign in to view funnel stats.",
    fallbackError: "Could not load funnel stats.",
    minLoadingMs: true,
  });

  return { stats: data, isLoading, error };
}
