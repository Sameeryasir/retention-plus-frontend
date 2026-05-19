"use client";

import { Suspense } from "react";
import { useFunnelTemplatePagesFromStorage } from "@/app/components/crm-template-editor/funnel-template-storage";
import { TemplatePreview } from "@/app/components/crm-template-editor/TemplatePreview";
import { useCampaignPricing } from "@/app/hooks/use-campaign-pricing";
import { useFunnelGuestRoute } from "@/app/hooks/use-funnel-guest-route";
import { buildFunnelPublicPath } from "@/app/lib/funnel-public-path";

function FunnelCampaignSignupInner() {
  const { funnelIdSegment, funnelId, campaignId, restaurantId } =
    useFunnelGuestRoute();

  const campaignPricing = useCampaignPricing(campaignId, restaurantId);
  const funnelLinkQuery = {
    campaignId,
    restaurantId,
    price: campaignPricing.subtotal ?? undefined,
  };

  const pages = useFunnelTemplatePagesFromStorage(funnelIdSegment);
  const signup = pages.signup;
  const landing = pages.landing;

  const signupNextHref =
    funnelId != null
      ? buildFunnelPublicPath({
          funnelId,
          step: "payment",
          query: funnelLinkQuery,
        })
      : undefined;

  const signupBackHref =
    funnelId != null
      ? buildFunnelPublicPath({
          funnelId,
          step: "landing",
          query: funnelLinkQuery,
        })
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
              trackingFunnelId={funnelId}
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
