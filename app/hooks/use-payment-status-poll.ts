"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getPaymentStatus,
  type FunnelPaymentStatusValue,
  type PaymentStatusResponse,
} from "@/app/services/payment/get-payment-status";

const TERMINAL: ReadonlySet<FunnelPaymentStatusValue> = new Set([
  "paid",
  "failed",
  "cancelled",
  "refunded",
  "partially_refunded",
  "disputed",
]);

type Options = {
  paymentId: number | null;
  enabled?: boolean;
  intervalMs?: number;
  maxAttempts?: number;
};

export function usePaymentStatusPoll({
  paymentId,
  enabled = true,
  intervalMs = 1500,
  maxAttempts = 40,
}: Options) {
  const [status, setStatus] = useState<FunnelPaymentStatusValue | null>(null);
  const [data, setData] = useState<PaymentStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const attemptsRef = useRef(0);

  const pollOnce = useCallback(async () => {
    if (paymentId == null) return null;
    const res = await getPaymentStatus(paymentId);
    setData(res);
    setStatus(res.status);
    return res;
  }, [paymentId]);

  useEffect(() => {
    if (!enabled || paymentId == null) {
      setStatus(null);
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    attemptsRef.current = 0;

    const tick = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await pollOnce();
        if (cancelled || !res) return;
        if (TERMINAL.has(res.status)) {
          setLoading(false);
          return;
        }
        attemptsRef.current += 1;
        if (attemptsRef.current >= maxAttempts) {
          setLoading(false);
          return;
        }
        window.setTimeout(() => void tick(), intervalMs);
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Could not verify payment status.",
          );
          setLoading(false);
        }
      }
    };

    void tick();

    return () => {
      cancelled = true;
    };
  }, [enabled, paymentId, intervalMs, maxAttempts, pollOnce]);

  const isPaid = status === "paid";
  const isTerminal = status != null && TERMINAL.has(status);

  return { status, data, loading, error, isPaid, isTerminal, refresh: pollOnce };
}
