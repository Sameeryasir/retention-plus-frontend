"use client";

import { Suspense, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useFunnelTemplatePagesFromStorage } from "@/app/components/crm-template-editor/funnel-template-storage";
import { TemplatePreview } from "@/app/components/crm-template-editor/TemplatePreview";
import type { FunnelStripePaymentContext } from "@/app/components/funnel/FunnelStripePaymentForm";
import { getFunnelCheckoutEmail } from "@/app/lib/funnel-checkout-storage";

function parsePositiveInt(raw: string | null | undefined): number | null {
  if (raw == null || raw === "") return null;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 1 ? n : null;
}

export default function FunnelCampaignPaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-zinc-100 text-sm text-zinc-500">
          Loading…
        </div>
      }
    >
      <FunnelCampaignPaymentPageInner />
    </Suspense>
  );
}

function FunnelCampaignPaymentPageInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [checkoutEmail] = useState(() => getFunnelCheckoutEmail());

  const campaignId = useMemo(() => {
    const raw = params.campaignId;
    if (typeof raw === "string" && raw.length > 0) return raw;
    if (Array.isArray(raw) && raw[0]) return raw[0];
    return "";
  }, [params.campaignId]);

  const pages = useFunnelTemplatePagesFromStorage(campaignId);
  const payment = pages.payment;
  const landing = pages.landing;

  const paymentStripeCheckout = useMemo((): FunnelStripePaymentContext | null => {
    const email = checkoutEmail?.trim();
    if (!email) return null;

    const funnelId = parsePositiveInt(campaignId);
    if (funnelId == null) return null;

    const fromQuery = parsePositiveInt(searchParams.get("restaurantId"));
    const fromEnv = parsePositiveInt(
      process.env.NEXT_PUBLIC_FUNNEL_PAYMENT_RESTAURANT_ID ?? null,
    );
    const restaurantId = fromQuery ?? fromEnv;
    if (restaurantId == null) return null;

    const amount =
      parsePositiveInt(searchParams.get("amount")) ?? 2000;
    const applicationFeeAmount =
      parsePositiveInt(searchParams.get("applicationFeeAmount")) ?? 200;
    const currency =
      searchParams.get("currency")?.trim().toLowerCase() || "usd";

    return {
      funnelId,
      restaurantId,
      amount,
      applicationFeeAmount,
      currency,
      customerEmail: email,
    };
  }, [campaignId, checkoutEmail, searchParams]);

  const showSetupHint =
    Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim()) &&
    paymentStripeCheckout == null &&
    Boolean(campaignId);

  return (
    <div className="flex min-h-dvh flex-col bg-zinc-100">
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="mx-auto w-full max-w-[390px] flex-none px-3 py-6 pb-12 sm:px-4">
          {showSetupHint ? (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
              {!checkoutEmail?.trim()
                ? "Complete signup first so we have your email."
                : "Add ?restaurantId=… to the URL or set NEXT_PUBLIC_FUNNEL_PAYMENT_RESTAURANT_ID."}
            </div>
          ) : null}
          <TemplatePreview
            page={payment}
            landingPage={landing}
            interactiveForms
            paymentStripeCheckout={paymentStripeCheckout}
          />
        </div>
      </main>
    </div>
  );
}
