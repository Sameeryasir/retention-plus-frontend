"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useFunnelTemplatePagesFromStorage } from "@/app/components/crm-template-editor/funnel-template-storage";
import { TemplatePreview } from "@/app/components/crm-template-editor/TemplatePreview";

export default function FunnelCampaignPaymentPage() {
  const params = useParams();
  const campaignId = useMemo(() => {
    const raw = params.campaignId;
    if (typeof raw === "string" && raw.length > 0) return raw;
    if (Array.isArray(raw) && raw[0]) return raw[0];
    return "";
  }, [params.campaignId]);

  const pages = useFunnelTemplatePagesFromStorage(campaignId);
  const payment = pages.payment;
  const landing = pages.landing;

  return (
    <div className="flex min-h-dvh flex-col bg-zinc-100">
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="mx-auto w-full max-w-[390px] flex-none px-3 py-6 pb-12 sm:px-4">
          <TemplatePreview
            page={payment}
            landingPage={landing}
            interactiveForms
          />
        </div>
      </main>
    </div>
  );
}
