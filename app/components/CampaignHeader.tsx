"use client";

import { ArrowLeft, Circle, Link2, Pencil } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

function parsePrice(raw: number | string | undefined): number | null {
  if (raw == null) return null;
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  const n = Number.parseFloat(String(raw).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function formatPrice(amount: number): string {
  if (Number.isInteger(amount)) return `$${amount}`;
  return `$${amount.toFixed(2)}`;
}

export type CampaignHeaderProps = {
  restaurantId: number;
  offer?: string;
  price?: number | string;
  defaultTabId?: string;
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;
  onGenerateTrackingLink?: () => void;
  onEdit?: () => void;
};

const TABS: { id: string; label: string; icon?: typeof Circle }[] = [
  { id: "overview", label: "Overview" },
  { id: "guests", label: "Guests" },
  { id: "orders", label: "Orders" },
  { id: "funnel", label: "Funnel" },
  { id: "automations", label: "Automations" },
  { id: "metrics", label: "Metrics" },
  { id: "offers", label: "Offers" },
  { id: "creative", label: "Creative Strategy", icon: Circle },
  { id: "ads", label: "Ads" },
];

export default function CampaignHeader({
  restaurantId,
  offer,
  price,
  defaultTabId = "overview",
  activeTabId: activeTabIdProp,
  onTabChange,
  onGenerateTrackingLink,
  onEdit,
}: CampaignHeaderProps) {
  const campaignsHref = `/restaurant/${restaurantId}/dashboard/campaigns`;
  const offerLine = offer?.trim() ?? "";
  const priceText = useMemo(() => {
    const n = parsePrice(price);
    return n != null ? formatPrice(n) : null;
  }, [price]);

  const offerPriceLine = useMemo(() => {
    const parts = [offerLine, priceText].filter(Boolean);
    if (parts.length === 0) return null;
    return parts.join(".");
  }, [offerLine, priceText]);

  const [internalTabId, setInternalTabId] = useState(defaultTabId);
  const isControlled =
    activeTabIdProp !== undefined && onTabChange !== undefined;
  const activeTabId = isControlled ? activeTabIdProp : internalTabId;

  const selectTab = useCallback(
    (id: string) => {
      if (isControlled) onTabChange(id);
      else setInternalTabId(id);
    },
    [isControlled, onTabChange],
  );

  const handleGenerate = useCallback(() => {
    onGenerateTrackingLink?.();
  }, [onGenerateTrackingLink]);

  const handleEdit = useCallback(() => {
    onEdit?.();
  }, [onEdit]);

  return (
    <header className="shrink-0 border-b border-zinc-200 bg-white">
      <div className="flex w-full flex-nowrap items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-4 sm:py-4 lg:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-1.5">
          <Link
            href={campaignsHref}
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-zinc-700 outline-none ring-offset-2 ring-offset-white transition-colors hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-blue-600/40"
            aria-label="Back to campaigns"
          >
            <ArrowLeft className="size-5" aria-hidden strokeWidth={2} />
          </Link>
          <div className="min-w-0 flex-1 text-left">
            {offerPriceLine ? (
              <p className="truncate text-left text-sm font-medium text-zinc-900 sm:text-base">
                {offerPriceLine}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex min-w-0 items-center gap-1.5 rounded-lg bg-blue-600 px-2.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:gap-2 sm:px-3 sm:text-sm"
          >
            <Link2 className="size-4 shrink-0" aria-hidden strokeWidth={2} />
            <span className="truncate">Generate Tracking Link</span>
          </button>
          <button
            type="button"
            onClick={handleEdit}
            aria-label="Edit campaign"
            className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30 focus-visible:ring-offset-2"
          >
            <Pencil className="size-[1.125rem]" aria-hidden strokeWidth={2} />
          </button>
        </div>
      </div>

      <nav
        className="border-t border-zinc-100"
        aria-label="Campaign sections"
      >
        <div className="flex w-full gap-1 overflow-x-auto px-3 sm:gap-2 sm:px-4 lg:px-6">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = id === activeTabId;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => selectTab(id)}
                className={`relative flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-3.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500/40 sm:px-4 ${
                  active
                    ? "text-blue-600 hover:bg-blue-50/80"
                    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                {Icon ? (
                  <Icon
                    className="size-3.5 shrink-0 text-current"
                    aria-hidden
                    strokeWidth={2}
                  />
                ) : null}
                {label}
                {active ? (
                  <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-blue-600 sm:inset-x-3" />
                ) : null}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
