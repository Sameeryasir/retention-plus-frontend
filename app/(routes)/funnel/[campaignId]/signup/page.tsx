"use client";

import { Suspense, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useFunnelTemplatePagesFromStorage } from "@/app/components/crm-template-editor/funnel-template-storage";
import { TemplatePreview } from "@/app/components/crm-template-editor/TemplatePreview";

function buildPaymentHref(campaignId: string, restaurantId: string | null) {
  const path = `/funnel/${encodeURIComponent(campaignId)}/payment`;
  if (!restaurantId?.trim()) return path;
  return `${path}?restaurantId=${encodeURIComponent(restaurantId.trim())}`;
}

function FunnelCampaignSignupInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const campaignId = useMemo(() => {
    const raw = params.campaignId;
    if (typeof raw === "string" && raw.length > 0) return raw;
    if (Array.isArray(raw) && raw[0]) return raw[0];
    return "";
  }, [params.campaignId]);

  const restaurantForPayment = useMemo(() => {
    const q = searchParams.get("restaurantId")?.trim();
    if (q) return q;
    return process.env.NEXT_PUBLIC_FUNNEL_PAYMENT_RESTAURANT_ID?.trim() ?? null;
  }, [searchParams]);

  const pages = useFunnelTemplatePagesFromStorage(campaignId);
  const signup = pages.signup;
  const landing = pages.landing;
  const signupNextHref = campaignId
    ? buildPaymentHref(campaignId, restaurantForPayment)
    : undefined;
  const signupBackHref = campaignId
    ? `/funnel/${encodeURIComponent(campaignId)}/landing`
    : undefined;

  return (
    <div className="flex min-h-dvh flex-col bg-zinc-100">
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="flex flex-1 flex-col justify-center px-3 py-8 sm:px-4">
          <div className="mx-auto w-full max-w-[390px] shrink-0">
            <TemplatePreview
              page={signup}
              landingPage={landing}
              signupNextHref={signupNextHref}
              signupBackHref={signupBackHref}
              interactiveForms
              submitCustomerOnSignupNext
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function FunnelCampaignSignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-zinc-100 text-sm text-zinc-500">
          Loading…
        </div>
      }
    >
      <FunnelCampaignSignupInner />
    </Suspense>
  );
}
