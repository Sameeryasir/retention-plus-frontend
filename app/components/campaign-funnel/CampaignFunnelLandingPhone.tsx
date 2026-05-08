"use client";

import type { ChangeEvent } from "react";
import Link from "next/link";
import type { FunnelPage } from "@/app/components/campaign-funnel/funnel-data";
import { LANDING_CTA_MAX } from "@/app/components/campaign-funnel/funnel-limits";
import { LandingStoryPreview } from "@/app/components/campaign-funnel/LandingStoryPreview";

export function CampaignFunnelLandingPhone({
  page,
  editing,
  fullPage = false,
  ctaHref,
  onPatch,
  onHeroFileChange,
  onClearHero,
}: {
  page: FunnelPage;
  editing: boolean;
  fullPage?: boolean;
  ctaHref?: string;
  onPatch: (patch: Partial<FunnelPage>) => void;
  onHeroFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClearHero: () => void;
}) {
  const ctaStripClass = `flex shrink-0 justify-center border-t border-zinc-200 bg-white ${
    fullPage
      ? "px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-5"
      : "px-3 py-3"
  }`;

  const pillClass = `inline-flex min-w-[13rem] max-w-[min(100%,18rem)] cursor-pointer items-center justify-center rounded-full bg-zinc-950 px-8 py-2.5 text-center font-semibold tracking-wide text-white shadow-sm ring-1 ring-black/25 outline-none transition duration-200 ease-out hover:scale-[1.03] hover:bg-black focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
    fullPage ? "text-base sm:text-lg" : "text-sm"
  }`;

  const column = (
    <>
      <div className={fullPage ? "flex min-h-0 min-w-0 flex-1 flex-col" : "min-w-0"}>
        <LandingStoryPreview
          page={page}
          fullPage={fullPage}
          editable={editing}
          onPatch={onPatch}
          onHeroFileChange={onHeroFileChange}
          onClearHero={onClearHero}
        />
      </div>
      {editing ? (
        <div className={ctaStripClass}>
          <input
            type="text"
            value={page.ctaLabel}
            maxLength={LANDING_CTA_MAX}
            onChange={(e) =>
              onPatch({
                ctaLabel: e.target.value.slice(0, LANDING_CTA_MAX),
              })
            }
            placeholder="Button label"
            aria-label="Button label"
            className={`${pillClass} w-max max-w-[min(100%,18rem)] border border-zinc-800 placeholder:text-zinc-500 focus:ring-2 focus:ring-white/35`}
          />
        </div>
      ) : ctaHref ? (
        <div className={ctaStripClass}>
          <Link href={ctaHref} className={pillClass}>
            {page.ctaLabel.trim() || "Claim"}
          </Link>
        </div>
      ) : (
        <div className={ctaStripClass}>
          <p className={pillClass}>{page.ctaLabel.trim() || "Claim"}</p>
        </div>
      )}
    </>
  );

  if (fullPage) {
    return (
      <div className="min-h-dvh w-full bg-zinc-100">
        <div className="mx-auto flex min-h-dvh w-full max-w-[20rem] flex-col bg-white shadow-sm ring-1 ring-black/5">
          {column}
        </div>
      </div>
    );
  }

  return <div className="flex flex-col bg-white">{column}</div>;
}
