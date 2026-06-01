"use client";

import { Suspense } from "react";
import { FunnelConfirmationView } from "@/app/components/funnel/FunnelConfirmationView";
import { useFunnelGuestRoute } from "@/app/hooks/use-funnel-guest-route";

function FunnelCampaignConfirmationInner() {
  const { funnelIdSegment, funnelId } = useFunnelGuestRoute();

  return (
    <FunnelConfirmationView
      funnelId={funnelId}
      templateStorageKey={funnelIdSegment}
    />
  );
}

export default function FunnelCampaignConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-zinc-100 text-sm text-zinc-500">
          Loading…
        </div>
      }
    >
      <FunnelCampaignConfirmationInner />
    </Suspense>
  );
}
