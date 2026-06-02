"use client";

import { Suspense } from "react";
import { FunnelPreviewSkeleton } from "@/app/components/crm-template-editor/FunnelPreviewSkeleton";
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
        <div className="flex min-h-dvh flex-col bg-zinc-100 px-3 py-8 sm:px-4">
          <div className="mx-auto w-full max-w-[390px] shrink-0">
            <FunnelPreviewSkeleton />
          </div>
        </div>
      }
    >
      <FunnelCampaignConfirmationInner />
    </Suspense>
  );
}
