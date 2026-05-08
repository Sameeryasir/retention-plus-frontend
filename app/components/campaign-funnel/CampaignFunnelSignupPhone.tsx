"use client";

import Link from "next/link";
import {
  normalizeSignupFormLayout,
  type FunnelPage,
} from "@/app/components/campaign-funnel/funnel-data";
import type { SignupSidebarFocus } from "@/app/components/campaign-funnel/SignupFunnelEditSidebar";
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
  /** When set and not editing, primary CTA is a link (e.g. `/funnel/payment` on public signup). */
  continueHref,
  /** Pencil + split layout: fields live in SignupFunnelEditSidebar; mock is tap-to-focus. */
  signupEditInSidebar = false,
  activeSignupFocus,
  onSelectSignupFocus,
  onPatch,
}: {
  signupPage: FunnelPage;
  landingPage: FunnelPage;
  editing: boolean;
  fullPage?: boolean;
  backHref?: string;
  continueHref?: string;
  signupEditInSidebar?: boolean;
  activeSignupFocus?: SignupSidebarFocus;
  onSelectSignupFocus?: (focus: SignupSidebarFocus) => void;
  onPatch: (patch: Partial<FunnelPage>) => void;
}) {
  const sidebarTap = Boolean(
    editing && signupEditInSidebar && onSelectSignupFocus,
  );
  const ringIf = (s: SignupSidebarFocus) =>
    sidebarTap && activeSignupFocus === s
      ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-white"
      : "";

  const layout = normalizeSignupFormLayout(signupPage.signupFormLayout);

  const backButtonClass =
    "flex-1 rounded-lg border border-zinc-200 bg-white py-2.5 text-center text-xs font-semibold tracking-wide text-zinc-800 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50";

  const primaryCtaClass = `min-w-0 flex-1 rounded-lg bg-zinc-900 py-2.5 text-center text-xs font-semibold tracking-wide text-white shadow-sm ring-1 ring-zinc-950/20 outline-none transition hover:bg-zinc-800 ${
    sidebarTap && activeSignupFocus === "cta"
      ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-white"
      : ""
  }`;

  type FieldCell = "first" | "last" | "phone";

  const fieldCell = (cell: FieldCell, inNameGrid: boolean) => {
    const inputCls = inNameGrid
      ? "w-full min-w-0 rounded-lg border border-zinc-200 bg-white px-2 py-2.5 text-left text-xs text-zinc-800 outline-none focus:border-zinc-300 focus:ring-1 focus:ring-zinc-900/15"
      : "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-left text-xs text-zinc-800 outline-none focus:border-zinc-300 focus:ring-1 focus:ring-zinc-900/15";
    const tapNameCls = `block w-full min-w-0 cursor-pointer truncate rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-2.5 text-left text-xs text-zinc-400 outline-none transition focus-visible:ring-2 focus-visible:ring-amber-400`;
    const tapNameFullCls = `block w-full cursor-pointer rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-left text-xs text-zinc-400 outline-none transition focus-visible:ring-2 focus-visible:ring-amber-400`;
    const staticNameGrid = "min-w-0 truncate rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-2.5 text-left text-xs text-zinc-400";
    const staticNameFull =
      "rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-left text-xs text-zinc-400";

    if (cell === "first") {
      if (editing && !sidebarTap) {
        return (
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
            placeholder={inNameGrid ? "First name" : "First name field label"}
            className={inputCls}
          />
        );
      }
      if (sidebarTap) {
        return (
          <button
            type="button"
            onClick={() => onSelectSignupFocus?.("firstName")}
            aria-label="Edit first name label in panel"
            className={`${inNameGrid ? tapNameCls : tapNameFullCls} ${ringIf("firstName")}`}
          >
            {signupPage.signupFirstNameLabel.trim() || "First name *"}
          </button>
        );
      }
      return (
        <div className={inNameGrid ? staticNameGrid : staticNameFull}>
          {signupPage.signupFirstNameLabel.trim() || "First name *"}
        </div>
      );
    }

    if (cell === "last") {
      if (editing && !sidebarTap) {
        return (
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
            placeholder={inNameGrid ? "Last name" : "Last name field label"}
            className={inputCls}
          />
        );
      }
      if (sidebarTap) {
        return (
          <button
            type="button"
            onClick={() => onSelectSignupFocus?.("lastName")}
            aria-label="Edit last name label in panel"
            className={`${inNameGrid ? tapNameCls : tapNameFullCls} ${ringIf("lastName")}`}
          >
            {signupPage.signupLastNameLabel.trim() || "Last name *"}
          </button>
        );
      }
      return (
        <div className={inNameGrid ? staticNameGrid : staticNameFull}>
          {signupPage.signupLastNameLabel.trim() || "Last name *"}
        </div>
      );
    }

    if (editing && !sidebarTap) {
      return (
        <input
          type="text"
          value={signupPage.signupPhoneLabel}
          maxLength={SIGNUP_LABEL_MAX}
          onChange={(e) =>
            onPatch({
              signupPhoneLabel: e.target.value.slice(0, SIGNUP_LABEL_MAX),
            })
          }
          placeholder="Phone field label"
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-left text-xs text-zinc-800 outline-none focus:border-zinc-300 focus:ring-1 focus:ring-zinc-900/15"
        />
      );
    }
    if (sidebarTap) {
      return (
        <button
          type="button"
          onClick={() => onSelectSignupFocus?.("phone")}
          aria-label="Edit phone label in panel"
          className={`flex w-full cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-left text-xs text-zinc-400 outline-none transition focus-visible:ring-2 focus-visible:ring-amber-400 ${ringIf("phone")}`}
        >
          <span className="text-base leading-none" aria-hidden>
            🇺🇸
          </span>
          <span className="font-medium text-zinc-500">+1</span>
          <span className="min-w-0 flex-1 truncate">
            {signupPage.signupPhoneLabel.trim() || "Phone *"}
          </span>
        </button>
      );
    }
    return (
      <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs text-zinc-400">
        <span className="text-base leading-none" aria-hidden>
          🇺🇸
        </span>
        <span className="font-medium text-zinc-500">+1</span>
        <span className="min-w-0 flex-1 truncate">
          {signupPage.signupPhoneLabel.trim() || "Phone *"}
        </span>
      </div>
    );
  };

  const signupFormBody =
    layout === "name_row" || layout === "name_row_reverse" ? (
      <>
        <div className="grid grid-cols-2 gap-2">
          {layout === "name_row" ? (
            <>
              {fieldCell("first", true)}
              {fieldCell("last", true)}
            </>
          ) : (
            <>
              {fieldCell("last", true)}
              {fieldCell("first", true)}
            </>
          )}
        </div>
        {fieldCell("phone", false)}
      </>
    ) : (
      <div className="space-y-2">
        {(layout === "phone_first"
          ? (["phone", "first", "last"] as const)
          : (["first", "last", "phone"] as const)
        ).map((c) => (
          <div key={c}>{fieldCell(c, false)}</div>
        ))}
      </div>
    );

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
        {editing && !sidebarTap ? (
          <div className="px-3 py-3">
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
        ) : sidebarTap ? (
          <div
            className={`px-4 py-3 transition ${ringIf("intro")}`}
          >
            <button
              type="button"
              onClick={() => onSelectSignupFocus?.("intro")}
              aria-label="Edit intro copy in panel"
              className="mx-auto block w-full max-w-[15.5rem] cursor-pointer rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-amber-400 sm:max-w-[16.5rem]"
            >
              {signupPage.body.trim() ? (
                <div className="space-y-2 text-center">
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
              ) : (
                <p className="py-2 text-center text-[0.65rem] text-zinc-400">
                  Intro copy — tap to edit in the panel
                </p>
              )}
            </button>
          </div>
        ) : signupPage.body.trim() ? (
          <div className="px-4 py-3 text-center">
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
        <div className="space-y-2 px-4 py-4">{signupFormBody}</div>
      </div>
      <div
        className={
          fullPage
            ? "shrink-0 bg-white px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
            : "mt-auto shrink-0 bg-white px-3 py-3"
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
          {editing && !sidebarTap ? (
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
          ) : sidebarTap ? (
            <button
              type="button"
              onClick={() => onSelectSignupFocus?.("cta")}
              aria-label="Edit primary button in panel"
              className={primaryCtaClass}
            >
              {signupPage.ctaLabel.trim() || "Next"}
            </button>
          ) : continueHref && !editing ? (
            <Link
              href={continueHref}
              className="flex-1 rounded-lg bg-zinc-900 py-2.5 text-center text-xs font-semibold tracking-wide text-white shadow-sm ring-1 ring-zinc-950/20 transition hover:bg-zinc-800"
            >
              {signupPage.ctaLabel.trim() || "Next"}
            </Link>
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
