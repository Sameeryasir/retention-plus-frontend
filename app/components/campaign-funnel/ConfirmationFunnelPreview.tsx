"use client";

import type { FunnelPage } from "@/app/components/campaign-funnel/funnel-data";

const THANK_YOU_COPY =
  "Thanks for trusting us. Your payment was successful.";

export function ConfirmationFunnelPreview({
  page,
  heroImageSrc,
}: {
  page: FunnelPage;
  /** Same hero as the landing step so the confirmation screen feels connected. */
  heroImageSrc?: string | null;
}) {
  return (
    <div className="flex flex-col bg-white">
      <div className="relative border-b-2 border-black bg-zinc-200">
        {heroImageSrc ? (
          <img
            src={heroImageSrc}
            alt=""
            className="aspect-[4/3] w-full object-cover"
          />
        ) : (
          <div className="flex aspect-[4/3] flex-col items-center justify-center gap-1 bg-zinc-100 px-3 text-center text-[0.65rem] text-zinc-500">
            <span>No hero image yet</span>
            <span className="text-zinc-400">Add one on the Landing step</span>
          </div>
        )}
      </div>
      <div className="space-y-3 border-b border-zinc-100 px-4 py-5 text-center">
        <p className="text-base font-bold leading-snug text-zinc-900">
          {page.headline.trim() || "You're all set"}
        </p>
        <p className="text-sm font-medium leading-snug text-zinc-800">
          {THANK_YOU_COPY}
        </p>
        {page.body.trim() ? (
          <p className="text-xs leading-relaxed text-zinc-600">{page.body}</p>
        ) : null}
      </div>
      <div className="px-4 py-4">
        <button
          type="button"
          className="w-full rounded-lg bg-zinc-900 py-2.5 text-sm font-semibold text-white shadow-sm ring-1 ring-zinc-950/20 transition hover:bg-zinc-800"
        >
          {page.ctaLabel.trim() || "View pass"}
        </button>
      </div>
    </div>
  );
}
