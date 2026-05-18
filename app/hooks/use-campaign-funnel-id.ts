"use client";

import { useEffect, useState } from "react";
import { getSetupAccessToken } from "@/app/lib/setup-access-token";
import {
  fetchFunnelByCampaignId,
  peekCachedFunnelId,
} from "@/app/services/funnel/get-funnel-by-campaign";
import { isPositiveInt } from "@/app/lib/numbers";

function initialFunnelIdLoading(campaignId: number | undefined): boolean {
  if (!isPositiveInt(campaignId)) return false;
  return peekCachedFunnelId(campaignId) == null;
}

export function useCampaignFunnelId(campaignId: number | undefined): {
  funnelId: number | null;
  isLoading: boolean;
} {
  const [funnelId, setFunnelId] = useState<number | null>(() =>
    campaignId != null ? peekCachedFunnelId(campaignId) : null,
  );
  const [isLoading, setIsLoading] = useState(() =>
    initialFunnelIdLoading(campaignId),
  );

  useEffect(() => {
    if (!isPositiveInt(campaignId)) {
      setFunnelId(null);
      setIsLoading(false);
      return;
    }

    const cached = peekCachedFunnelId(campaignId);
    if (cached != null) {
      setFunnelId(cached);
      setIsLoading(false);
      return;
    }

    const token = getSetupAccessToken().trim();
    if (!token) {
      setFunnelId(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    void fetchFunnelByCampaignId(token, campaignId)
      .then((remote) => {
        if (cancelled) return;
        setFunnelId(isPositiveInt(remote?.id) ? remote.id : null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [campaignId]);

  return { funnelId, isLoading };
}
