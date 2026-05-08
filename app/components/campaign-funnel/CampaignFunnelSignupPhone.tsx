"use client";

import Link from "next/link";
import type { FunnelPage } from "@/app/components/campaign-funnel/funnel-data";
import {
  LANDING_BODY_MAX,
  LANDING_CTA_MAX,
  SIGNUP_LABEL_MAX,
} from "@/app/components/campaign-funnel/funnel-limits";
import { LandingStoryPreview } from "@/app/components/campaign-funnel/LandingStoryPreview";

export function CampaignFunnelSignupPhone({
  signupPage,
  landingPage,
  editing,
  fullPage = false,
  backHref,
  onPatch,
}: {
  signupPage: FunnelPage;
  landingPage: FunnelPage;
  editing: boolean;
  fullPage?: boolean;
  backHref?: string;
  onPatch: (patch: Partial<FunnelPage>) => void;
}) {
  const backButtonClass =
    "flex-1 rounded-lg border border-zinc-200 bg-white py-2.5 text-center text-xs font-semibold tracking-wide text-zinc-800 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50";

  const mainColumn = (
    <div
      className={
        fullPage
          ? "flex min-h-0 w-full flex-1 flex-col bg-white"
          : "flex flex-col bg-white"
      }
    >
      <div className={fullPage ? "min-w-0 flex-1" : "min-w-0"}>
        <LandingStoryPreview
          page={landingPage}
          showBody={false}
          fullPage={fullPage}
        />
        {editing ? (
          <div className="border-t border-zinc-100 px-3 py-3">
            <textarea
              value={signupPage.body}
              maxLength={LANDING_BODY_MAX}
              onChange={(e) =>
                onPatch({
                  body: e.target.value.slice(0, LANDING_BODY_MAX),
                })
              }
              rows={6}
              placeholder="Intro copy above the form"
              className="w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-2 text-center text-[0.7rem] leading-relaxed text-zinc-700 outline-none focus:border-zinc-300 focus:bg-white focus:ring-1 focus:ring-zinc-900/15"
            />
          </div>
        ) : signupPage.body.trim() ? (
          <div className="border-t border-zinc-100 px-4 py-3 text-center">
            <div className="mx-auto max-w-[15.5rem] space-y-2 sm:max-w-[16.5rem]">
              {signupPage.body
                .trim()
                .split(/\n\n+/)
                .map((para, i) => (
                  <p
                    key={i}
                    className="text-[0.7rem] leading-relaxed text-zinc-600"
                  >
                    {para.trim()}
                  </p>
                ))}
            </div>
          </div>
        ) : null}
        <div className="space-y-2 border-t border-zinc-100 px-4 py-4">
          {editing ? (
            <>
              <input
                type="text"
                value={signupPage.signupFirstNameLabel}
                maxLength={SIGNUP_LABEL_MAX}
                onChange={(e) =>
                  onPatch({
                    signupFirstNameLabel: e.target.value.slice(
                      0,
                      SIGNUP_LABEL_MAX,
                    ),
                  })
                }
                placeholder="First name field label"
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-left text-xs text-zinc-800 outline-none focus:border-zinc-300 focus:ring-1 focus:ring-zinc-900/15"
              />
              <input
                type="text"
                value={signupPage.signupLastNameLabel}
                maxLength={SIGNUP_LABEL_MAX}
                onChange={(e) =>
                  onPatch({
                    signupLastNameLabel: e.target.value.slice(
                      0,
                      SIGNUP_LABEL_MAX,
                    ),
                  })
                }
                placeholder="Last name field label"
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-left text-xs text-zinc-800 outline-none focus:border-zinc-300 focus:ring-1 focus:ring-zinc-900/15"
              />
              <input
                type="text"
                value={signupPage.signupPhoneLabel}
                maxLength={SIGNUP_LABEL_MAX}
                onChange={(e) =>
                  onPatch({
                    signupPhoneLabel: e.target.value.slice(
                      0,
                      SIGNUP_LABEL_MAX,
                    ),
                  })
                }
                placeholder="Phone field label"
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-left text-xs text-zinc-800 outline-none focus:border-zinc-300 focus:ring-1 focus:ring-zinc-900/15"
              />
            </>
          ) : (
            <>
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-left text-xs text-zinc-400">
                {signupPage.signupFirstNameLabel.trim() || "First name *"}
              </div>
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-left text-xs text-zinc-400">
                {signupPage.signupLastNameLabel.trim() || "Last name *"}
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs text-zinc-400">
                <span className="text-base leading-none" aria-hidden>
                  🇺🇸
                </span>
                <span className="font-medium text-zinc-500">+1</span>
                <span className="min-w-0 flex-1 truncate">
                  {signupPage.signupPhoneLabel.trim() || "Phone *"}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
      <div
        className={
          fullPage
            ? "shrink-0 border-t border-zinc-200 bg-white px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
            : "mt-auto shrink-0 border-t border-zinc-200 bg-white px-3 py-3"
        }
      >
        <div className="flex gap-2">
          {backHref && !editing ? (
            <Link href={backHref} className={backButtonClass}>
              Back
            </Link>
          ) : (
            <button type="button" className={backButtonClass}>
              Back
            </button>
          )}
          {editing ? (
            <input
              type="text"
              value={signupPage.ctaLabel}
              maxLength={LANDING_CTA_MAX}
              onChange={(e) =>
                onPatch({
                  ctaLabel: e.target.value.slice(0, LANDING_CTA_MAX),
                })
              }
              placeholder="Next"
              aria-label="Primary button label"
              className="min-w-0 flex-1 rounded-lg border border-zinc-900 bg-zinc-900 py-2.5 text-center text-xs font-semibold tracking-wide text-white outline-none ring-zinc-950/20 placeholder:text-zinc-500 focus:ring-2 focus:ring-white/30"
            />
          ) : (
            <button
              type="button"
              className="flex-1 rounded-lg bg-zinc-900 py-2.5 text-xs font-semibold tracking-wide text-white shadow-sm ring-1 ring-zinc-950/20 transition hover:bg-zinc-800"
            >
              {signupPage.ctaLabel.trim() || "Next"}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-dvh w-full bg-zinc-100">
        <div className="mx-auto flex min-h-dvh w-full max-w-[20rem] flex-col bg-white shadow-sm ring-1 ring-black/5">
          {mainColumn}
        </div>
      </div>
    );
  }

  return mainColumn;
}
