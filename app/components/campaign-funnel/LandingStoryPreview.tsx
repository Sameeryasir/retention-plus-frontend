"use client";

import { type ChangeEvent, useId } from "react";
import type { FunnelPage } from "@/app/components/campaign-funnel/funnel-data";
import {
  LANDING_BODY_MAX,
  LANDING_HEADLINE_MAX,
  LANDING_PAGE_TITLE_MAX,
  LANDING_SUBHEADLINE_MAX,
} from "@/app/components/campaign-funnel/funnel-limits";

export function LandingStoryPreview({
  page,
  showBody = true,
  fullPage = false,
  editable = false,
  onPatch,
  onHeroFileChange,
  onClearHero,
}: {
  page: FunnelPage;
  showBody?: boolean;
  fullPage?: boolean;
  editable?: boolean;
  onPatch?: (patch: Partial<FunnelPage>) => void;
  onHeroFileChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onClearHero?: () => void;
}) {
  const heroFileId = useId();

  return (
    <>
      {editable && onPatch ? (
        <div className="border-b border-zinc-100 px-3 py-2.5">
          <label
            htmlFor={`${heroFileId}-tab-title`}
            className="block text-[0.55rem] font-semibold uppercase tracking-wide text-zinc-400"
          >
            Tab title (browser tab)
          </label>
          <input
            id={`${heroFileId}-tab-title`}
            type="text"
            value={page.pageTitle}
            maxLength={LANDING_PAGE_TITLE_MAX}
            onChange={(e) =>
              onPatch({
                pageTitle: e.target.value.slice(0, LANDING_PAGE_TITLE_MAX),
              })
            }
            className="mt-1 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-[0.7rem] text-zinc-900 outline-none focus:border-zinc-400 focus:bg-white focus:ring-1 focus:ring-zinc-900/15"
          />
        </div>
      ) : null}
      <div className="relative border-b-2 border-black bg-zinc-200">
        {page.heroImageSrc ? (
          <img
            src={page.heroImageSrc}
            alt=""
            className={
              fullPage
                ? "max-h-[min(52dvh,36rem)] w-full object-cover sm:max-h-[min(48dvh,40rem)]"
                : "aspect-[4/3] w-full object-cover"
            }
          />
        ) : (
          <div
            className={`relative flex flex-col items-center justify-center gap-1 bg-zinc-100 px-3 text-center text-[0.65rem] text-zinc-500 ${
              fullPage
                ? "min-h-[min(40dvh,20rem)] sm:min-h-[min(36dvh,24rem)]"
                : "aspect-[4/3]"
            }`}
          >
            <span>Hero image</span>
            <span className="text-zinc-400">
              {editable
                ? "Choose a photo for the top of the page"
                : "Upload in Page settings"}
            </span>
            {editable && onHeroFileChange ? (
              <>
                <input
                  id={`${heroFileId}-hero-empty`}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={onHeroFileChange}
                />
                <label
                  htmlFor={`${heroFileId}-hero-empty`}
                  className="mt-2 cursor-pointer rounded-lg bg-zinc-900 px-3 py-1.5 text-[0.65rem] font-semibold text-white shadow-sm transition hover:bg-zinc-800"
                >
                  Choose image
                </label>
              </>
            ) : null}
          </div>
        )}
        {editable && onHeroFileChange && page.heroImageSrc ? (
          <>
            <input
              id={`${heroFileId}-hero`}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={onHeroFileChange}
            />
            <label
              htmlFor={`${heroFileId}-hero`}
              className="absolute inset-0 flex cursor-pointer items-end justify-center bg-gradient-to-t from-black/50 to-transparent pb-3 text-[0.65rem] font-medium text-white opacity-0 transition hover:opacity-100 focus-within:opacity-100"
            >
              <span className="rounded-full bg-black/60 px-2.5 py-1 backdrop-blur-sm">
                Change image
              </span>
            </label>
            {onClearHero ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClearHero();
                }}
                className="absolute right-2 top-2 z-10 rounded-md bg-black/70 px-2 py-1 text-[0.6rem] font-medium text-white backdrop-blur-sm transition hover:bg-black/90"
              >
                Remove
              </button>
            ) : null}
          </>
        ) : null}
      </div>
      <div
        className={`border-b border-zinc-100 text-center ${
          fullPage ? "px-6 py-8 sm:px-10 sm:py-10" : "px-4 py-4"
        }`}
      >
        {editable && onPatch ? (
          <>
            <input
              type="text"
              value={page.headline}
              maxLength={LANDING_HEADLINE_MAX}
              onChange={(e) =>
                onPatch({
                  headline: e.target.value.slice(0, LANDING_HEADLINE_MAX),
                })
              }
              placeholder="Headline"
              className={`w-full rounded-md bg-transparent text-center font-bold leading-snug text-zinc-900 outline-none ring-zinc-400 placeholder:text-zinc-300 focus:ring-2 focus:ring-offset-1 ${
                fullPage ? "text-lg sm:text-2xl" : "text-[0.95rem]"
              }`}
            />
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
              placeholder="Subheadline"
              className={`mt-2 w-full rounded-md bg-transparent text-center font-medium leading-snug text-zinc-600 outline-none ring-zinc-400 placeholder:text-zinc-300 focus:ring-2 focus:ring-offset-1 ${
                fullPage ? "text-sm sm:text-base" : "text-xs"
              }`}
            />
          </>
        ) : (
          <>
            <p
              className={`font-bold leading-snug text-zinc-900 ${
                fullPage ? "text-lg sm:text-2xl" : "text-[0.95rem]"
              }`}
            >
              {page.headline.trim() || "\u00a0"}
            </p>
            <p
              className={`mt-2 font-medium leading-snug text-zinc-600 ${
                fullPage ? "text-sm sm:text-base" : "mt-1 text-xs"
              }`}
            >
              {page.subheadline.trim() || "\u00a0"}
            </p>
          </>
        )}
      </div>
      {showBody ? (
        editable && onPatch ? (
          <div
            className={`min-h-0 flex-1 ${fullPage ? "px-4 py-6 sm:px-8" : "px-2 py-3"}`}
          >
            <textarea
              value={page.body}
              maxLength={LANDING_BODY_MAX}
              onChange={(e) =>
                onPatch({ body: e.target.value.slice(0, LANDING_BODY_MAX) })
              }
              placeholder="Body copy — blank lines create new paragraphs on the live page."
              rows={10}
              className={`h-full min-h-[7.5rem] w-full resize-y rounded-md border border-transparent bg-transparent text-center leading-relaxed text-zinc-600 outline-none focus:border-zinc-200 focus:bg-zinc-50/80 ${
                fullPage
                  ? "px-2 py-1 text-sm sm:text-base"
                  : "px-2 py-1 text-[0.7rem]"
              }`}
            />
          </div>
        ) : (
          <div
            className={`mx-auto text-center ${
              fullPage
                ? "flex-1 space-y-4 px-4 py-6 sm:space-y-5 sm:px-5 sm:py-8"
                : "flex-1 space-y-3 px-4 py-4"
            }`}
          >
            {page.body.split(/\n\n+/).map((para, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? fullPage
                      ? "text-base font-extrabold uppercase leading-snug tracking-wide text-zinc-900 sm:text-lg"
                      : "text-[0.8rem] font-extrabold uppercase leading-snug tracking-wide text-zinc-900"
                    : fullPage
                      ? "text-sm leading-relaxed text-zinc-600 sm:text-base"
                      : "text-[0.7rem] leading-relaxed text-zinc-600"
                }
              >
                {para.trim().split(/\n/).map((line, j) => (
                  <span key={j}>
                    {j > 0 ? <br /> : null}
                    {line}
                  </span>
                ))}
              </p>
            ))}
          </div>
        )
      ) : null}
    </>
  );
}
