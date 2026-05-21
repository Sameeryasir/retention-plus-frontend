"use client";

import { useCallback } from "react";
import { useTokenGatedResource } from "@/app/hooks/use-token-gated-resource";
import { getSetupAccessToken } from "@/app/lib/setup-access-token";
import {
  getFunnelPayments,
  type FunnelPayment,
} from "@/app/services/payment/get-funnel-payments";

function sortPayments(list: FunnelPayment[]): FunnelPayment[] {
  return [...list].sort((a, b) => {
    const ta = a.paidAt ?? a.createdAt;
    const tb = b.paidAt ?? b.createdAt;
    return new Date(tb).getTime() - new Date(ta).getTime();
  });
}

export function useFunnelPayments(funnelId: number | null | undefined) {
  const token = getSetupAccessToken().trim();

  const fetch = useCallback(async (authToken: string, id: number) => {
    const list = await getFunnelPayments(authToken, id);
    return sortPayments(list);
  }, []);

  const { data, isLoading, error } = useTokenGatedResource<FunnelPayment[]>({
    resourceId: funnelId,
    token,
    fetch,
    noTokenError: "Sign in to view orders.",
    fallbackError: "Could not load payments.",
    initialLoading: funnelId != null && funnelId >= 1,
    resetWhenDisabled: [],
  });

  return {
    payments: data ?? [],
    isLoading,
    error,
  };
}
