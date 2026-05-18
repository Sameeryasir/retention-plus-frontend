"use client";

import { useEffect, useState } from "react";
import { API_MIN_LOADING_MS, delay } from "@/app/lib/api";
import { getSetupAccessToken } from "@/app/lib/setup-access-token";
import { isPositiveInt } from "@/app/lib/numbers";
import {
  getFunnelPayments,
  type FunnelPayment,
} from "@/app/services/payment/get-funnel-payments";

export function useFunnelPayments(funnelId: number | null | undefined) {
  const [payments, setPayments] = useState<FunnelPayment[]>([]);
  const [isLoading, setIsLoading] = useState(() => isPositiveInt(funnelId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isPositiveInt(funnelId)) {
      setPayments([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const token = getSetupAccessToken().trim();
    if (!token) {
      setPayments([]);
      setError("Sign in to view orders.");
      setIsLoading(false);
      return;
    }

    void Promise.all([getFunnelPayments(token, funnelId), delay(API_MIN_LOADING_MS)])
      .then(([list]) => {
        if (!cancelled) {
          setPayments(
            [...list].sort((a, b) => {
              const ta = a.paidAt ?? a.createdAt;
              const tb = b.paidAt ?? b.createdAt;
              return new Date(tb).getTime() - new Date(ta).getTime();
            }),
          );
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setPayments([]);
          setError(
            e instanceof Error ? e.message : "Could not load payments.",
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

  return { payments, isLoading, error };
}
