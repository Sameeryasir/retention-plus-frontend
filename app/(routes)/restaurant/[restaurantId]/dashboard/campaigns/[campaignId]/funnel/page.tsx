"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import CampaignFunnelEditor from "@/app/components/CampaignFunnelEditor";

function parseId(raw: unknown): number | undefined {
  if (typeof raw !== "string" || !/^\d+$/.test(raw)) return undefined;
  const n = Number.parseInt(raw, 10);
  return n >= 1 ? n : undefined;
}

export default function CampaignFunnelEditorPage() {
  const params = useParams();
  const restaurantId = useMemo(
    () => parseId(params.restaurantId),
    [params.restaurantId],
  );
  const campaignId = useMemo(
    () => parseId(params.campaignId),
    [params.campaignId],
  );

  if (restaurantId == null || campaignId == null) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10 text-center text-sm text-zinc-700">
        <p>Invalid link.</p>
        <Link
          href="/dashboard"
          className="mt-4 inline-block font-medium text-zinc-900 underline underline-offset-2"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100dvh-5rem)] w-full flex-col lg:min-h-[calc(100dvh-4.5rem)]">
      <CampaignFunnelEditor
        restaurantId={restaurantId}
        campaignId={campaignId}
      />
    </div>
  );
}
