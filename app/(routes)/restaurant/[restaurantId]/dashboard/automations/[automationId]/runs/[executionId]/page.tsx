"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AutomationRunDetailPage } from "@/app/components/automation/AutomationRunDetailPage";
import { parsePositiveInt } from "@/app/lib/numbers";
import { resolveAutomationNumericId } from "@/app/lib/resolve-automation-id";
import { getAutomationById } from "@/app/services/automation/automation-api";

function parseRestaurantId(raw: unknown): number | undefined {
  if (typeof raw !== "string" || !/^\d+$/.test(raw)) return undefined;
  const n = Number.parseInt(raw, 10);
  return n >= 1 ? n : undefined;
}

export default function AutomationRunDetailRoute() {
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
  const executionId = useMemo(
    () => parsePositiveInt(params.executionId),
    [params.executionId],
  );
  const [automationName, setAutomationName] = useState<string | undefined>();

  const automationNumericId = useMemo(
    () => resolveAutomationNumericId(automationId),
    [automationId],
  );

  useEffect(() => {
    if (automationNumericId == null) {
      setAutomationName(undefined);
      return;
    }
    let cancelled = false;
    void getAutomationById(automationNumericId)
      .then((automation) => {
        if (!cancelled) setAutomationName(automation.name);
      })
      .catch(() => {
        if (!cancelled) setAutomationName(undefined);
      });
    return () => {
      cancelled = true;
    };
  }, [automationNumericId]);

  if (
    restaurantId == null ||
    !automationId ||
    executionId == null
  ) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10 text-center text-sm text-zinc-700">
        <p>Invalid run link.</p>
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
    <AutomationRunDetailPage
      restaurantId={restaurantId}
      automationId={automationId}
      automationName={automationName}
      executionId={executionId}
      funnelId={funnelId}
    />
  );
}
