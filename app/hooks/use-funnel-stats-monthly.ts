"use client";

import { useCallback } from "react";
import { useTokenGatedResource } from "@/app/hooks/use-token-gated-resource";
import {
  getFunnelStatsMonthly,
  type FunnelStatsMonthly,
} from "@/app/services/funnel/get-funnel-stats-monthly";
import { funnelQueryKeys } from "@/app/services/funnel/funnel-query-keys";
import { OVERVIEW_MONTH_COUNT } from "@/app/components/campaign/overview/charts/overview-chart-config";

export function useFunnelStatsMonthly(funnelId: number | null | undefined) {
  const fetch = useCallback(
    (id: number) => getFunnelStatsMonthly(id, OVERVIEW_MONTH_COUNT),
    [],
  );

  const { data, isLoading, error } = useTokenGatedResource<FunnelStatsMonthly>({
    resourceId: funnelId,
    queryKey:
      funnelId != null
        ? funnelQueryKeys.statsMonthlyByFunnel(funnelId, OVERVIEW_MONTH_COUNT)
        : funnelQueryKeys.statsMonthly(),
    queryFn: fetch,
    noTokenError: "Sign in to view monthly funnel stats.",
    fallbackError: "Could not load monthly funnel stats.",
  });

  return { monthly: data, isLoading, error };
}
