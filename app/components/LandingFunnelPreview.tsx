"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useFunnelTemplatePagesFromStorage } from "@/app/components/crm-template-editor/funnel-template-storage";
import { TemplatePreview } from "@/app/components/crm-template-editor/TemplatePreview";

export function LandingFunnelPreview() {
  const params = useParams();
  const campaignId = useMemo(() => {
    const raw = params.campaignId;
    if (typeof raw === "string" && raw.length > 0) return raw;
    if (Array.isArray(raw) && raw[0]) return raw[0];
    return "";
  }, [params.campaignId]);

  const pages = useFunnelTemplatePagesFromStorage(campaignId);
  const landing = pages.landing;
  const landingCtaHref = campaignId
    ? `/funnel/${encodeURIComponent(campaignId)}/signup`
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
