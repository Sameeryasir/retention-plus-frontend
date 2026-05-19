"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { AutomationBuilderPage } from "@/app/components/automation/AutomationBuilderPage";
import { parsePositiveInt } from "@/app/lib/numbers";
import { resolveAutomationNumericId } from "@/app/lib/resolve-automation-id";

function parseRestaurantId(raw: unknown): number | undefined {
  if (typeof raw !== "string" || !/^\d+$/.test(raw)) return undefined;
  const n = Number.parseInt(raw, 10);
  return n >= 1 ? n : undefined;
}

export default function RestaurantAutomationBuilderRoute() {
  const params = useParams();
  const searchParams = useSearchParams();
  const funnelId = useMemo(
    () => parsePositiveInt(searchParams.get("funnelId")),
    [searchParams],
  );
  const restaurantId = useMemo(
    () => parseRestaurantId(params.restaurantId),
    [params.restaurantId],
  );
  const automationId =
    typeof params.automationId === "string" ? params.automationId : "";

  if (restaurantId == null || !automationId) {
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

  const automationNumericId = resolveAutomationNumericId(automationId);

  return (
    <AutomationBuilderPage
      restaurantId={restaurantId}
      automationId={automationId}
      automationNumericId={automationNumericId}
      funnelId={funnelId}
    />
  );
}
