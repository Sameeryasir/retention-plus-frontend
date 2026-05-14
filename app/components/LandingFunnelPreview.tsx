"use client";

import { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useFunnelTemplatePagesFromStorage } from "@/app/components/crm-template-editor/funnel-template-storage";
import { TemplatePreview } from "@/app/components/crm-template-editor/TemplatePreview";

function buildSignupHref(campaignId: string, restaurantId: string | null) {
  const path = `/funnel/${encodeURIComponent(campaignId)}/signup`;
  if (!restaurantId?.trim()) return path;
  return `${path}?restaurantId=${encodeURIComponent(restaurantId.trim())}`;
}

export function LandingFunnelPreview() {
  const params = useParams();
  const searchParams = useSearchParams();
  const campaignId = useMemo(() => {
    const raw = params.campaignId;
    if (typeof raw === "string" && raw.length > 0) return raw;
    if (Array.isArray(raw) && raw[0]) return raw[0];
    return "";
  }, [params.campaignId]);

  const restaurantForLinks = useMemo(() => {
    const q = searchParams.get("restaurantId")?.trim();
    if (q) return q;
    return process.env.NEXT_PUBLIC_FUNNEL_PAYMENT_RESTAURANT_ID?.trim() ?? null;
  }, [searchParams]);

  const pages = useFunnelTemplatePagesFromStorage(campaignId);
  const landing = pages.landing;
  const landingCtaHref = campaignId
    ? buildSignupHref(campaignId, restaurantForLinks)
    : undefined;

  return (
    <div className="w-full min-w-0">
      <TemplatePreview
        page={landing}
        landingPage={landing}
        landingCtaHref={landingCtaHref}
      />
    </div>
  );
}
