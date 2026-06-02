"use client";

import { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { TemplatePreview } from "@/app/components/crm-template-editor/TemplatePreview";
import { FunnelPreviewSkeleton } from "@/app/components/crm-template-editor/FunnelPreviewSkeleton";
import { useFunnelTemplatePagesFromStorage } from "@/app/components/crm-template-editor/funnel-template-storage";
import { FunnelGuestPageShell } from "@/app/components/funnel/FunnelGuestPageShell";
import { PaymentConfirmedSprinkles } from "@/app/components/funnel/PaymentConfirmedSprinkles";
import {
  getFunnelCheckoutCustomerId,
  getFunnelPaymentId,
} from "@/app/lib/funnel-checkout-storage";
import { getOrCreateVisitorId } from "@/app/lib/funnel-visitor-id";
import { trackFunnelEvent } from "@/app/services/funnel/track-funnel-event";

export function FunnelConfirmationView({
  funnelId,
  templateStorageKey,
}: {
  funnelId: number | null;
  templateStorageKey: string;
}) {
  const searchParams = useSearchParams();
  const trackedRef = useRef(false);

  const celebrate = useMemo(() => {
    if (searchParams.get("redirect_status") === "succeeded") return true;
    if (searchParams.get("payment_confirmed") === "1") return true;
    return false;
  }, [searchParams]);

  const { pages, isLoading } = useFunnelTemplatePagesFromStorage(templateStorageKey);

  useEffect(() => {
    getOrCreateVisitorId();
    if (!celebrate || funnelId == null) return;
    if (trackedRef.current) return;
    trackedRef.current = true;

    const funnelPaymentId = getFunnelPaymentId();
    const customerId = getFunnelCheckoutCustomerId();
    if (funnelPaymentId == null) return;

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
  }, [celebrate, funnelId]);

  return (
    <>
      <PaymentConfirmedSprinkles active={celebrate} />
      <FunnelGuestPageShell>
        {isLoading ? (
          <FunnelPreviewSkeleton />
        ) : (
          <TemplatePreview
            page={pages.confirmation}
            landingPage={pages.landing}
            fullPageShellChrome
            trackingFunnelId={funnelId}
          />
        )}
      </FunnelGuestPageShell>
    </>
  );
}
