"use client";

/**
 * Landing funnel: right-hand editor when the landing phone is in pencil mode.
 * Lets merchants edit hero image, headline, subheadline, body, and CTA
 * without crowding the phone mock — matches tap-to-section flow on the preview.
 * Related: CampaignFunnelEditor, CampaignFunnelLandingPhone, LandingStoryPreview.
 */

import { type ChangeEvent, useId } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlignLeft,
  Heading1,
  Heading2,
  Image as ImageIcon,
  ImageUp,
  MousePointerClick,
  SlidersHorizontal,
  Trash2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import type { FunnelPage } from "@/app/components/campaign-funnel/funnel-data";
import {
  HERO_IMAGE_SCALE_MAX,
  HERO_IMAGE_SCALE_MIN,
  heroImageTransformStyle,
  LANDING_BODY_MAX,
  LANDING_CTA_MAX,
  LANDING_HEADLINE_MAX,
  LANDING_SUBHEADLINE_MAX,
  normalizeHeroImageScale,
} from "@/app/components/campaign-funnel/funnel-limits";

// --- Public types (used by preview tap targets + editor state) ---
export type LandingSidebarSection =
  | "hero"
  | "headline"
  | "subheadline"
  | "body"
  | "cta";

const TABS: {
  id: LandingSidebarSection;
  label: string;
  Icon: LucideIcon;
}[] = [
  { id: "hero", label: "Photo", Icon: ImageIcon },
  { id: "headline", label: "Headline", Icon: Heading1 },
  { id: "subheadline", label: "Subheadline", Icon: Heading2 },
  { id: "body", label: "Body", Icon: AlignLeft },
  { id: "cta", label: "Button", Icon: MousePointerClick },
];

export function LandingHeroEditSidebar({
  page,
  activeSection,
  onSelectSection,
  onPatch,
  onHeroFileChange,
  onClearHero,
}: {
  page: FunnelPage;
  activeSection: LandingSidebarSection;
  onSelectSection: (section: LandingSidebarSection) => void;
  onPatch: (patch: Partial<FunnelPage>) => void;
  onHeroFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClearHero: () => void;
}) {
  const uid = useId();
  const heroInputId = `${uid}-hero-file`;

  return (
    <div className="flex min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-zinc-200/90 bg-gradient-to-b from-white via-white to-zinc-50/70 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.18)] ring-1 ring-zinc-950/[0.06]">
      {/* --- Section tabs (icons match each block on the phone mock) --- */}
      <div
        className="flex shrink-0 gap-0.5 overflow-x-auto border-b border-zinc-200/80 bg-zinc-50/95 p-1.5 backdrop-blur-[2px]"
        role="tablist"
        aria-label="Landing page sections"
      >
        {TABS.map((t) => {
          const selected = activeSection === t.id;
          const TabIcon = t.Icon;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onSelectSection(t.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition duration-200 ${
                selected
                  ? "bg-zinc-900 text-white shadow-md shadow-zinc-900/25 ring-1 ring-black/20"
                  : "text-zinc-600 hover:bg-white hover:text-zinc-900 hover:shadow-sm"
              }`}
            >
              <TabIcon
                className={`size-3.5 shrink-0 ${selected ? "text-white" : "text-zinc-500"}`}
                strokeWidth={2}
                aria-hidden
              />
              <span className="whitespace-nowrap">{t.label}</span>
            </button>
          );
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[radial-gradient(120%_80%_at_50%_-20%,rgba(24,24,27,0.04),transparent)] p-4 sm:p-5">
        {/* --- Photo: hero image only --- */}
        {activeSection === "hero" ? (
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-zinc-900/5 text-zinc-700 ring-1 ring-zinc-900/10">
                <ImageIcon className="size-3.5" strokeWidth={2} aria-hidden />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
                Hero image
              </span>
            </div>
            <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200/90 bg-zinc-100 shadow-inner ring-1 ring-zinc-950/[0.04]">
              {page.heroImageSrc ? (
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={page.heroImageSrc}
                    alt=""
                    style={heroImageTransformStyle(page.heroImageScale)}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-[4/3] flex-col items-center justify-center gap-3 px-4 text-center">
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-zinc-200/60 text-zinc-400 ring-1 ring-zinc-300/50">
                    <ImageIcon className="size-7" strokeWidth={1.25} aria-hidden />
                  </span>
                  <span className="text-xs font-medium text-zinc-500">
                    No photo yet — upload to fill the hero
                  </span>
                </div>
              )}
            </div>
            {page.heroImageSrc ? (
              <div className="mt-4 rounded-xl border border-zinc-200/80 bg-gradient-to-b from-zinc-50 to-zinc-100/80 p-3.5 shadow-sm ring-1 ring-zinc-950/[0.03]">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-600">
                    <SlidersHorizontal
                      className="size-3.5 text-zinc-500"
                      strokeWidth={2}
                      aria-hidden
                    />
                    Photo zoom
                  </span>
                  <span className="rounded-md bg-white/90 px-2 py-0.5 text-xs font-bold tabular-nums text-zinc-800 shadow-sm ring-1 ring-zinc-200/80">
                    {Math.round(
                      normalizeHeroImageScale(page.heroImageScale) * 100,
                    )}
                    %
                  </span>
                </div>
                <p className="mt-1.5 text-[0.65rem] leading-relaxed text-zinc-500">
                  Smaller shows more of the picture in the frame; larger zooms
                  in on the center.
                </p>
                <div className="mt-3 flex items-center gap-2.5">
                  <ZoomOut
                    className="size-4 shrink-0 text-zinc-400"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <input
                    type="range"
                    className="h-2.5 w-full min-w-0 flex-1 cursor-pointer accent-zinc-900"
                    min={Math.round(HERO_IMAGE_SCALE_MIN * 100)}
                    max={Math.round(HERO_IMAGE_SCALE_MAX * 100)}
                    step={1}
                    value={Math.round(
                      normalizeHeroImageScale(page.heroImageScale) * 100,
                    )}
                    onChange={(e) =>
                      onPatch({
                        heroImageScale: Number(e.target.value) / 100,
                      })
                    }
                    aria-label="Photo zoom in frame"
                  />
                  <ZoomIn
                    className="size-4 shrink-0 text-zinc-400"
                    strokeWidth={2}
                    aria-hidden
                  />
                </div>
                <div className="mt-1.5 flex justify-between text-[0.6rem] font-medium text-zinc-400">
                  <span>Smaller</span>
                  <span>Larger</span>
                </div>
              </div>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              <input
                id={heroInputId}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={onHeroFileChange}
              />
              <label
                htmlFor={heroInputId}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-zinc-900 px-3.5 py-2.5 text-xs font-semibold text-white shadow-md shadow-zinc-900/20 ring-1 ring-black/10 transition hover:bg-zinc-800 hover:shadow-lg"
              >
                <ImageUp className="size-3.5" strokeWidth={2} aria-hidden />
                {page.heroImageSrc ? "Replace image" : "Upload image"}
              </label>
              {page.heroImageSrc ? (
                <button
                  type="button"
                  onClick={onClearHero}
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-200/90 bg-white px-3.5 py-2.5 text-xs font-semibold text-zinc-700 shadow-sm ring-1 ring-zinc-950/[0.04] transition hover:border-red-200 hover:bg-red-50/80 hover:text-red-800"
                >
                  <Trash2 className="size-3.5" strokeWidth={2} aria-hidden />
                  Remove
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        {activeSection === "headline" ? (
          <label className="block">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-600">
              <span className="flex size-7 items-center justify-center rounded-lg bg-zinc-900/5 text-zinc-700 ring-1 ring-zinc-900/10">
                <Heading1 className="size-3.5" strokeWidth={2} aria-hidden />
              </span>
              Headline
            </span>
            <textarea
              value={page.headline}
              maxLength={LANDING_HEADLINE_MAX}
              onChange={(e) =>
                onPatch({
                  headline: e.target.value.slice(0, LANDING_HEADLINE_MAX),
                })
              }
              rows={4}
              className="mt-2 w-full resize-y rounded-xl border border-zinc-200/90 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm ring-1 ring-zinc-950/[0.03] outline-none transition placeholder:text-zinc-400 focus:border-zinc-300 focus:shadow-md focus:ring-2 focus:ring-zinc-900/12"
            />
          </label>
        ) : null}

        {activeSection === "subheadline" ? (
          <label className="block">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-600">
              <span className="flex size-7 items-center justify-center rounded-lg bg-zinc-900/5 text-zinc-700 ring-1 ring-zinc-900/10">
                <Heading2 className="size-3.5" strokeWidth={2} aria-hidden />
              </span>
              Subheadline
            </span>
            <input
              type="text"
              value={page.subheadline}
              maxLength={LANDING_SUBHEADLINE_MAX}
              onChange={(e) =>
                onPatch({
                  subheadline: e.target.value.slice(
                    0,
                    LANDING_SUBHEADLINE_MAX,
                  ),
                })
              }
              className="mt-2 w-full rounded-xl border border-zinc-200/90 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm ring-1 ring-zinc-950/[0.03] outline-none transition focus:border-zinc-300 focus:shadow-md focus:ring-2 focus:ring-zinc-900/12"
            />
          </label>
        ) : null}

        {activeSection === "body" ? (
          <label className="block">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-600">
              <span className="flex size-7 items-center justify-center rounded-lg bg-zinc-900/5 text-zinc-700 ring-1 ring-zinc-900/10">
                <AlignLeft className="size-3.5" strokeWidth={2} aria-hidden />
              </span>
              Body copy
            </span>
            <p className="mt-1.5 flex items-start gap-1.5 text-[0.65rem] leading-relaxed text-zinc-500">
              <AlignLeft className="mt-0.5 size-3 shrink-0 text-zinc-400" strokeWidth={2} aria-hidden />
              Blank lines become new paragraphs on the live page.
            </p>
            <textarea
              value={page.body}
              maxLength={LANDING_BODY_MAX}
              onChange={(e) =>
                onPatch({ body: e.target.value.slice(0, LANDING_BODY_MAX) })
              }
              rows={14}
              className="mt-2 w-full resize-y rounded-xl border border-zinc-200/90 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm ring-1 ring-zinc-950/[0.03] outline-none transition focus:border-zinc-300 focus:shadow-md focus:ring-2 focus:ring-zinc-900/12"
            />
          </label>
        ) : null}

        {activeSection === "cta" ? (
          <label className="block">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-600">
              <span className="flex size-7 items-center justify-center rounded-lg bg-zinc-900/5 text-zinc-700 ring-1 ring-zinc-900/10">
                <MousePointerClick className="size-3.5" strokeWidth={2} aria-hidden />
              </span>
              Button label
            </span>
            <input
              type="text"
              value={page.ctaLabel}
              maxLength={LANDING_CTA_MAX}
              onChange={(e) =>
                onPatch({
                  ctaLabel: e.target.value.slice(0, LANDING_CTA_MAX),
                })
              }
              className="mt-2 w-full rounded-xl border border-zinc-200/90 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm ring-1 ring-zinc-950/[0.03] outline-none transition focus:border-zinc-300 focus:shadow-md focus:ring-2 focus:ring-zinc-900/12"
            />
          </label>
        ) : null}
      </div>
    </div>
  );
}
