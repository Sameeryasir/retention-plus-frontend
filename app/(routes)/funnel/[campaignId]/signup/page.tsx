"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useFunnelTemplatePagesFromStorage } from "@/app/components/crm-template-editor/funnel-template-storage";
import { TemplatePreview } from "@/app/components/crm-template-editor/TemplatePreview";

export default function FunnelCampaignSignupPage() {
  const params = useParams();
  const campaignId = useMemo(() => {
    const raw = params.campaignId;
    if (typeof raw === "string" && raw.length > 0) return raw;
    if (Array.isArray(raw) && raw[0]) return raw[0];
    return "";
  }, [params.campaignId]);

  const pages = useFunnelTemplatePagesFromStorage(campaignId);
  const signup = pages.signup;
  const landing = pages.landing;
  const signupNextHref = campaignId
    ? `/funnel/${encodeURIComponent(campaignId)}/payment`
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
