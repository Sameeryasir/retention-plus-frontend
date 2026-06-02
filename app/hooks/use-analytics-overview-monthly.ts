"use client";

import { useCallback } from "react";
import { useTokenGatedResource } from "@/app/hooks/use-token-gated-resource";
import {
  getAnalyticsOverviewMonthly,
  type FunnelAnalyticsMonthly,
} from "@/app/services/funnel/get-analytics-overview-monthly";
import { funnelQueryKeys } from "@/app/services/funnel/funnel-query-keys";
import { OVERVIEW_MONTH_COUNT } from "@/app/components/campaign/overview/charts/overview-chart-config";

export function useAnalyticsOverviewMonthly(funnelId: number | null | undefined) {
  const fetch = useCallback(
    (id: number) => getAnalyticsOverviewMonthly(id, OVERVIEW_MONTH_COUNT),
    [],
  );

  const { data, isLoading, error } = useTokenGatedResource<FunnelAnalyticsMonthly>({
    resourceId: funnelId,
    queryKey:
      funnelId != null
        ? funnelQueryKeys.analyticsMonthlyByFunnel(
            funnelId,
            OVERVIEW_MONTH_COUNT,
          )
        : funnelQueryKeys.analyticsMonthly(),
    queryFn: fetch,
    noTokenError: "Sign in to view monthly behavior analytics.",
    fallbackError: "Could not load monthly behavior analytics.",
  });

  return { monthly: data, isLoading, error };
}
