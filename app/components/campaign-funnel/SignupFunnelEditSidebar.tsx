"use client";

/**
 * Sign-up funnel: right-hand panel in pencil mode. Intro + CTA stay as tabs;
 * the Form tab shows a tappable mini-form (same layout as the phone) plus
 * layout presets so merchants edit labels in context instead of raw fields only.
 * Related: CampaignFunnelEditor, CampaignFunnelSignupPhone, funnel-data SignupFormLayout.
 */

import type { LucideIcon } from "lucide-react";
import {
  AlignLeft,
  Columns2,
  GitCompareArrows,
  MousePointerClick,
  PanelTop,
  Phone,
  Rows3,
  Smartphone,
  User,
  Users,
} from "lucide-react";
import {
  normalizeSignupFormLayout,
  type FunnelPage,
  type SignupFormLayout,
} from "@/app/components/campaign-funnel/funnel-data";
import {
  LANDING_BODY_MAX,
  LANDING_CTA_MAX,
  SIGNUP_LABEL_MAX,
} from "@/app/components/campaign-funnel/funnel-limits";

export type SignupSidebarFocus =
  | "intro"
  | "firstName"
  | "lastName"
  | "phone"
  | "cta";

export function signupFocusIsFormField(
  f: SignupSidebarFocus,
): f is "firstName" | "lastName" | "phone" {
  return f === "firstName" || f === "lastName" || f === "phone";
}

type SidebarTabId = "intro" | "form" | "cta";

const TOP_TABS: { id: SidebarTabId; label: string; Icon: LucideIcon }[] = [
  { id: "intro", label: "Intro", Icon: AlignLeft },
  { id: "form", label: "Form", Icon: PanelTop },
  { id: "cta", label: "Button", Icon: MousePointerClick },
];

const LAYOUT_PRESETS: {
  id: SignupFormLayout;
  label: string;
  hint: string;
  Icon: LucideIcon;
}[] = [
  {
    id: "stacked",
    label: "Stacked",
    hint: "First, last, phone",
    Icon: Rows3,
  },
  {
    id: "name_row",
    label: "Names row",
    hint: "First | last, phone",
    Icon: Columns2,
  },
  {
    id: "phone_first",
    label: "Phone first",
    hint: "Phone, then names",
    Icon: Smartphone,
  },
  {
    id: "name_row_reverse",
    label: "Last | first",
    hint: "Swap name columns",
    Icon: GitCompareArrows,
  },
];

export function SignupFunnelEditSidebar({
  signupPage,
  activeFocus,
  onSelectFocus,
  onPatch,
}: {
  signupPage: FunnelPage;
  activeFocus: SignupSidebarFocus;
  onSelectFocus: (focus: SignupSidebarFocus) => void;
  onPatch: (patch: Partial<FunnelPage>) => void;
}) {
  const layout = normalizeSignupFormLayout(signupPage.signupFormLayout);

  const tabSelected = (id: SidebarTabId) => {
    if (id === "intro") return activeFocus === "intro";
    if (id === "cta") return activeFocus === "cta";
    return signupFocusIsFormField(activeFocus);
  };

  const handleTab = (id: SidebarTabId) => {
    if (id === "intro") onSelectFocus("intro");
    else if (id === "cta") onSelectFocus("cta");
    else onSelectFocus("firstName");
  };

  const fieldRing = (field: "firstName" | "lastName" | "phone") =>
    signupFocusIsFormField(activeFocus) && activeFocus === field
      ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-white"
      : "ring-1 ring-zinc-200/90";

  const fieldShell =
    "w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-left text-xs text-zinc-600 transition hover:bg-zinc-100/80";

  const miniFirstBtn = (
    <button
      type="button"
      onClick={() => onSelectFocus("firstName")}
      className={`${fieldShell} ${fieldRing("firstName")}`}
    >
      <span className="flex min-w-0 items-center gap-1.5 font-medium text-zinc-500">
        <User className="size-3 shrink-0" strokeWidth={2} aria-hidden />
        <span className="min-w-0 truncate">
          {signupPage.signupFirstNameLabel.trim() || "First name *"}
        </span>
      </span>
    </button>
  );

  const miniLastBtn = (
    <button
      type="button"
      onClick={() => onSelectFocus("lastName")}
      className={`${fieldShell} ${fieldRing("lastName")}`}
    >
      <span className="flex min-w-0 items-center gap-1.5 font-medium text-zinc-500">
        <Users className="size-3 shrink-0" strokeWidth={2} aria-hidden />
        <span className="min-w-0 truncate">
          {signupPage.signupLastNameLabel.trim() || "Last name *"}
        </span>
      </span>
    </button>
  );

  const miniPhoneBtn = (
    <button
      type="button"
      onClick={() => onSelectFocus("phone")}
      className={`flex w-full items-center gap-2 ${fieldShell} ${fieldRing("phone")}`}
    >
      <span className="text-base leading-none" aria-hidden>
        🇺🇸
      </span>
      <span className="font-medium text-zinc-500">+1</span>
      <Phone className="size-3 shrink-0 text-zinc-400" strokeWidth={2} aria-hidden />
      <span className="min-w-0 flex-1 truncate text-left font-medium text-zinc-500">
        {signupPage.signupPhoneLabel.trim() || "Phone *"}
      </span>
    </button>
  );

  const miniPhoneForm = (
    <div
      className="rounded-xl border border-zinc-200/90 bg-white p-3 shadow-sm ring-1 ring-zinc-950/[0.04]"
      role="group"
      aria-label="Form preview — tap a field to edit its label"
    >
      {layout === "name_row" || layout === "name_row_reverse" ? (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {layout === "name_row" ? (
              <>
                {miniFirstBtn}
                {miniLastBtn}
              </>
            ) : (
              <>
                {miniLastBtn}
                {miniFirstBtn}
              </>
            )}
          </div>
          {miniPhoneBtn}
        </div>
      ) : layout === "phone_first" ? (
        <div className="space-y-2">
          {miniPhoneBtn}
          {miniFirstBtn}
          {miniLastBtn}
        </div>
      ) : (
        <div className="space-y-2">
          {miniFirstBtn}
          {miniLastBtn}
          {miniPhoneBtn}
        </div>
      )}
    </div>
  );

  const layoutControls = (
    <div>
      <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-zinc-500">
        Field layout
      </p>
      <p className="mt-0.5 text-[0.65rem] leading-relaxed text-zinc-500">
        Pick a preset — the phone preview updates to match.
      </p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {LAYOUT_PRESETS.map((p) => {
          const Icon = p.Icon;
          const on = layout === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onPatch({ signupFormLayout: p.id })}
              className={`flex flex-col items-start gap-1 rounded-xl border px-2.5 py-2 text-left transition ${
                on
                  ? "border-zinc-900 bg-zinc-900 text-white shadow-md ring-1 ring-black/15"
                  : "border-zinc-200/90 bg-white text-zinc-800 shadow-sm ring-1 ring-zinc-950/[0.04] hover:border-zinc-300"
              }`}
            >
              <Icon
                className={`size-[1.35rem] shrink-0 ${on ? "text-white" : "text-zinc-600"}`}
                strokeWidth={2.25}
                aria-hidden
              />
              <span className="text-xs font-semibold leading-tight">{p.label}</span>
              <span
                className={`text-[0.6rem] leading-snug ${on ? "text-zinc-300" : "text-zinc-500"}`}
              >
                {p.hint}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const activeFieldEditor =
    signupFocusIsFormField(activeFocus) ? (
      <label className="mt-4 block">
        <span className="text-xs font-semibold text-zinc-700">
          {activeFocus === "firstName"
            ? "First name label"
            : activeFocus === "lastName"
              ? "Last name label"
              : "Phone field label"}
        </span>
        <input
          type="text"
          value={
            activeFocus === "firstName"
              ? signupPage.signupFirstNameLabel
              : activeFocus === "lastName"
                ? signupPage.signupLastNameLabel
                : signupPage.signupPhoneLabel
          }
          maxLength={SIGNUP_LABEL_MAX}
          onChange={(e) => {
            const v = e.target.value.slice(0, SIGNUP_LABEL_MAX);
            if (activeFocus === "firstName")
              onPatch({ signupFirstNameLabel: v });
            else if (activeFocus === "lastName")
              onPatch({ signupLastNameLabel: v });
            else onPatch({ signupPhoneLabel: v });
          }}
          className="mt-1.5 w-full rounded-xl border border-zinc-200/90 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm ring-1 ring-zinc-950/[0.03] outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/12"
        />
      </label>
    ) : null;

  return (
    <div className="flex min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-zinc-200/90 bg-gradient-to-b from-white via-white to-zinc-50/70 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.18)] ring-1 ring-zinc-950/[0.06]">
      <div
        className="flex shrink-0 gap-0.5 overflow-x-auto border-b border-zinc-200/80 bg-zinc-50/95 p-1.5 backdrop-blur-[2px]"
        role="tablist"
        aria-label="Sign up page sections"
      >
        {TOP_TABS.map((t) => {
          const selected = tabSelected(t.id);
          const TabIcon = t.Icon;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => handleTab(t.id)}
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
        {activeFocus === "intro" ? (
          <label className="block">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-600">
              <span className="flex size-7 items-center justify-center rounded-lg bg-zinc-900/5 text-zinc-700 ring-1 ring-zinc-900/10">
                <AlignLeft className="size-3.5" strokeWidth={2} aria-hidden />
              </span>
              Intro copy
            </span>
            <p className="mt-1.5 text-[0.65rem] leading-relaxed text-zinc-500">
              Shown above the form on the sign-up screen. Blank lines become
              new paragraphs.
            </p>
            <textarea
              value={signupPage.body}
              maxLength={LANDING_BODY_MAX}
              onChange={(e) =>
                onPatch({
                  body: e.target.value.slice(0, LANDING_BODY_MAX),
                })
              }
              rows={12}
              className="mt-2 w-full resize-y rounded-xl border border-zinc-200/90 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm ring-1 ring-zinc-950/[0.03] outline-none transition focus:border-zinc-300 focus:shadow-md focus:ring-2 focus:ring-zinc-900/12"
            />
          </label>
        ) : null}

        {signupFocusIsFormField(activeFocus) ? (
          <div>
            {layoutControls}
            <p className="mt-4 text-[0.65rem] font-semibold uppercase tracking-wide text-zinc-500">
              Form preview
            </p>
            <p className="mt-0.5 text-[0.65rem] leading-relaxed text-zinc-500">
              Tap a field below, then edit its label. The phone mock highlights
              the same field.
            </p>
            <div className="mt-2">{miniPhoneForm}</div>
            {activeFieldEditor}
          </div>
        ) : null}

        {activeFocus === "cta" ? (
          <label className="block">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-600">
              <span className="flex size-7 items-center justify-center rounded-lg bg-zinc-900/5 text-zinc-700 ring-1 ring-zinc-900/10">
                <MousePointerClick
                  className="size-3.5"
                  strokeWidth={2}
                  aria-hidden
                />
              </span>
              Primary button
            </span>
            <input
              type="text"
              value={signupPage.ctaLabel}
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
