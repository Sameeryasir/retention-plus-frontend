"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  getFunnelCheckoutCustomerId,
  getFunnelCheckoutFunnelId,
  getFunnelPaymentId,
} from "@/app/lib/funnel-checkout-storage";
import { getOrCreateVisitorId } from "@/app/lib/funnel-visitor-id";
import { parsePositiveInt } from "@/app/lib/numbers";
import { trackFunnelEvent } from "@/app/services/funnel/track-funnel-event";

function PaymentSuccessInner() {
  const searchParams = useSearchParams();
  const trackedRef = useRef(false);

  useEffect(() => {
    getOrCreateVisitorId();

    const redirectStatus = searchParams.get("redirect_status");
    if (redirectStatus !== "succeeded") return;
    if (trackedRef.current) return;
    trackedRef.current = true;

    const funnelId =
      parsePositiveInt(searchParams.get("funnelId")) ??
      getFunnelCheckoutFunnelId();
    const funnelPaymentId = getFunnelPaymentId();
    const customerId = getFunnelCheckoutCustomerId();

    if (funnelId == null || funnelPaymentId == null) return;

    void trackFunnelEvent({
      eventType: "payment",
      funnelId,
      funnelPaymentId,
      paymentStatus: "paid",
      visitorId: getOrCreateVisitorId(),
      ...(customerId != null ? { customerId } : {}),
    }).catch((err) => {
      console.warn("[Funnel] payment track failed", err);
    });
  }, [searchParams]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-zinc-100 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <Check className="size-7" strokeWidth={2.5} aria-hidden />
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
          Payment submitted
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          Thank you. If your bank needs extra verification, follow any prompts from
          Stripe. You will receive confirmation by email when the payment is finalized.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-zinc-900 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-zinc-100 text-sm text-zinc-500">
          Loading…
        </div>
      }
    >
      <PaymentSuccessInner />
    </Suspense>
  );
}
