"use client";

import { useCallback } from "react";
import { useTokenGatedResource } from "@/app/hooks/use-token-gated-resource";
import {
  getAnalyticsOverview,
  type FunnelAnalyticsOverview,
} from "@/app/services/funnel/get-analytics-overview";
import { funnelQueryKeys } from "@/app/services/funnel/funnel-query-keys";

export function useAnalyticsOverview(funnelId: number | null | undefined) {
  const fetch = useCallback(
    (id: number) => getAnalyticsOverview(id),
    [],
  );

  const { data, isLoading, error } = useTokenGatedResource<FunnelAnalyticsOverview>({
    resourceId: funnelId,
    queryKey:
      funnelId != null
        ? funnelQueryKeys.analyticsOverviewByFunnel(funnelId)
        : funnelQueryKeys.analyticsOverview(),
    queryFn: fetch,
    noTokenError: "Sign in to view behavior analytics.",
    fallbackError: "Could not load behavior analytics.",
  });

  return { overview: data, isLoading, error };
}
