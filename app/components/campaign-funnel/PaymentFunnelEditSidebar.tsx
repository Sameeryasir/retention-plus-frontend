"use client";

/**
 * Payment funnel: right-hand panel in pencil mode (mirrors SignupFunnelEditSidebar).
 * Intro + Checkout + Button tabs; checkout uses tap targets + editor synced to the phone mock.
 */

import type { LucideIcon } from "lucide-react";
import {
  AlignLeft,
  Columns2,
  CreditCard,
  LayoutList,
  Mail,
  MousePointerClick,
  User,
  UserRound,
  Wallet,
} from "lucide-react";
import {
  normalizePaymentCheckoutLayout,
  type FunnelPage,
  type PaymentCheckoutLayout,
} from "@/app/components/campaign-funnel/funnel-data";
import {
  LANDING_BODY_MAX,
  LANDING_CTA_MAX,
  LANDING_HEADLINE_MAX,
  LANDING_SUBHEADLINE_MAX,
  PAYMENT_MOCK_CARD_NUMBER_MAX,
  PAYMENT_MOCK_FIELD_MAX,
} from "@/app/components/campaign-funnel/funnel-limits";

export type PaymentSidebarFocus =
  | "intro"
  | "lineItem"
  | "payLink"
  | "contactTitle"
  | "email"
  | "fullName"
  | "contactPhone"
  | "methodTitle"
  | "cardNumber"
  | "cardBrand"
  | "expiry"
  | "cvc"
  | "nameOnCard"
  | "country"
  | "saveLabel"
  | "cta";

export function paymentFocusIsCheckoutDetail(
  f: PaymentSidebarFocus,
): boolean {
  return f !== "intro" && f !== "cta";
}

type TabId = "intro" | "checkout" | "cta";

const TOP_TABS: { id: TabId; label: string; Icon: LucideIcon }[] = [
  { id: "intro", label: "Intro", Icon: AlignLeft },
  { id: "checkout", label: "Checkout", Icon: Wallet },
  { id: "cta", label: "Button", Icon: MousePointerClick },
];

const PAYMENT_LAYOUT_PRESETS: {
  id: PaymentCheckoutLayout;
  label: string;
  hint: string;
  Icon: LucideIcon;
}[] = [
  {
    id: "standard",
    label: "Standard",
    hint: "Pay link, then contact",
    Icon: LayoutList,
  },
  {
    id: "contact_first",
    label: "Contact first",
    hint: "Details before pay link",
    Icon: UserRound,
  },
  {
    id: "card_first",
    label: "Card first",
    hint: "Card before contact",
    Icon: CreditCard,
  },
  {
    id: "contact_inline",
    label: "Tight contact",
    hint: "Email | name, then phone",
    Icon: Columns2,
  },
];

const CHECKOUT_ROWS: {
  focus: PaymentSidebarFocus;
  label: string;
  Icon: LucideIcon;
}[] = [
  { focus: "lineItem", label: "Deal line", Icon: CreditCard },
  { focus: "payLink", label: "Pay with link", Icon: Wallet },
  { focus: "contactTitle", label: "Contact heading", Icon: User },
  { focus: "email", label: "Email", Icon: Mail },
  { focus: "fullName", label: "Full name", Icon: User },
  { focus: "contactPhone", label: "Phone", Icon: User },
  { focus: "methodTitle", label: "Payment method title", Icon: CreditCard },
  { focus: "cardNumber", label: "Card number", Icon: CreditCard },
  { focus: "cardBrand", label: "Card brand", Icon: CreditCard },
  { focus: "expiry", label: "Expiry", Icon: CreditCard },
  { focus: "cvc", label: "CVC", Icon: CreditCard },
  { focus: "nameOnCard", label: "Name on card", Icon: User },
  { focus: "country", label: "Country", Icon: User },
  { focus: "saveLabel", label: "Save info label", Icon: User },
];

export function PaymentFunnelEditSidebar({
  page,
  activeFocus,
  onSelectFocus,
  onPatch,
}: {
  page: FunnelPage;
  activeFocus: PaymentSidebarFocus;
  onSelectFocus: (f: PaymentSidebarFocus) => void;
  onPatch: (patch: Partial<FunnelPage>) => void;
}) {
  const layout = normalizePaymentCheckoutLayout(page.paymentCheckoutLayout);

  const tabSelected = (id: TabId) => {
    if (id === "intro") return activeFocus === "intro";
    if (id === "cta") return activeFocus === "cta";
    return paymentFocusIsCheckoutDetail(activeFocus);
  };

  const handleTab = (id: TabId) => {
    if (id === "intro") onSelectFocus("intro");
    else if (id === "cta") onSelectFocus("cta");
    else onSelectFocus("lineItem");
  };

  const rowRing = (f: PaymentSidebarFocus) =>
    paymentFocusIsCheckoutDetail(activeFocus) && activeFocus === f
      ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-white"
      : "ring-1 ring-zinc-200/90";

  const rowBtn =
    "flex w-full items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-2 text-left text-xs text-zinc-600 transition hover:bg-zinc-100/80";

  const layoutControls = (
    <div>
      <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-zinc-500">
        Section layout
      </p>
      <p className="mt-0.5 text-[0.65rem] leading-relaxed text-zinc-500">
        Reorders blocks on the checkout mock to match your flow.
      </p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {PAYMENT_LAYOUT_PRESETS.map((p) => {
          const Icon = p.Icon;
          const on = layout === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onPatch({ paymentCheckoutLayout: p.id })}
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

  const checkoutPreview = (
    <div
      className="max-h-[min(52vh,22rem)] space-y-1.5 overflow-y-auto overscroll-contain rounded-xl border border-zinc-200/90 bg-white p-2.5 shadow-sm ring-1 ring-zinc-950/[0.04]"
      role="group"
      aria-label="Checkout fields — tap to edit"
    >
      {CHECKOUT_ROWS.map((r) => {
        const Icon = r.Icon;
        return (
          <button
            key={r.focus}
            type="button"
            onClick={() => onSelectFocus(r.focus)}
            className={`${rowBtn} ${rowRing(r.focus)}`}
          >
            <Icon className="size-3.5 shrink-0 text-zinc-400" strokeWidth={2} aria-hidden />
            <span className="min-w-0 flex-1 font-medium text-zinc-700">{r.label}</span>
          </button>
        );
      })}
    </div>
  );

  const fieldEditor = paymentFocusIsCheckoutDetail(activeFocus) ? (
    <div className="mt-4 space-y-3">
      {activeFocus === "lineItem" ? (
        <input
          type="text"
          value={page.headline}
          maxLength={LANDING_HEADLINE_MAX}
          onChange={(e) =>
            onPatch({
              headline: e.target.value.slice(0, LANDING_HEADLINE_MAX),
            })
          }
          className="w-full rounded-xl border border-zinc-200/90 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm ring-1 ring-zinc-950/[0.03] outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/12"
        />
      ) : null}
      {activeFocus === "payLink" ? (
        <input
          type="text"
          value={page.subheadline}
          maxLength={LANDING_SUBHEADLINE_MAX}
          onChange={(e) =>
            onPatch({
              subheadline: e.target.value.slice(0, LANDING_SUBHEADLINE_MAX),
            })
          }
          className="w-full rounded-xl border border-zinc-200/90 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm ring-1 ring-zinc-950/[0.03] outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/12"
        />
      ) : null}
      {activeFocus === "contactTitle" ? (
        <input
          type="text"
          value={page.paymentMockContactTitle ?? ""}
          maxLength={PAYMENT_MOCK_FIELD_MAX}
          onChange={(e) =>
            onPatch({
              paymentMockContactTitle: e.target.value.slice(
                0,
                PAYMENT_MOCK_FIELD_MAX,
              ),
            })
          }
          className="w-full rounded-xl border border-zinc-200/90 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm ring-1 ring-zinc-950/[0.03] outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/12"
        />
      ) : null}
      {activeFocus === "email" ? (
        <input
          type="text"
          value={page.paymentMockEmail ?? ""}
          maxLength={PAYMENT_MOCK_FIELD_MAX}
          onChange={(e) =>
            onPatch({
              paymentMockEmail: e.target.value.slice(
                0,
                PAYMENT_MOCK_FIELD_MAX,
              ),
            })
          }
          className="w-full rounded-xl border border-zinc-200/90 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm ring-1 ring-zinc-950/[0.03] outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/12"
        />
      ) : null}
      {activeFocus === "fullName" ? (
        <input
          type="text"
          value={page.paymentMockFullName ?? ""}
          maxLength={PAYMENT_MOCK_FIELD_MAX}
          onChange={(e) =>
            onPatch({
              paymentMockFullName: e.target.value.slice(
                0,
                PAYMENT_MOCK_FIELD_MAX,
              ),
            })
          }
          className="w-full rounded-xl border border-zinc-200/90 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm ring-1 ring-zinc-950/[0.03] outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/12"
        />
      ) : null}
      {activeFocus === "contactPhone" ? (
        <input
          type="text"
          value={page.paymentMockPhone ?? ""}
          maxLength={PAYMENT_MOCK_FIELD_MAX}
          onChange={(e) =>
            onPatch({
              paymentMockPhone: e.target.value.slice(
                0,
                PAYMENT_MOCK_FIELD_MAX,
              ),
            })
          }
          className="w-full rounded-xl border border-zinc-200/90 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm ring-1 ring-zinc-950/[0.03] outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/12"
        />
      ) : null}
      {activeFocus === "methodTitle" ? (
        <input
          type="text"
          value={page.paymentMockMethodTitle ?? ""}
          maxLength={PAYMENT_MOCK_FIELD_MAX}
          onChange={(e) =>
            onPatch({
              paymentMockMethodTitle: e.target.value.slice(
                0,
                PAYMENT_MOCK_FIELD_MAX,
              ),
            })
          }
          className="w-full rounded-xl border border-zinc-200/90 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm ring-1 ring-zinc-950/[0.03] outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/12"
        />
      ) : null}
      {activeFocus === "cardNumber" ? (
        <input
          type="text"
          value={page.paymentMockCardNumber ?? ""}
          maxLength={PAYMENT_MOCK_CARD_NUMBER_MAX}
          onChange={(e) =>
            onPatch({
              paymentMockCardNumber: e.target.value.slice(
                0,
                PAYMENT_MOCK_CARD_NUMBER_MAX,
              ),
            })
          }
          className="w-full rounded-xl border border-zinc-200/90 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm ring-1 ring-zinc-950/[0.03] outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/12"
        />
      ) : null}
      {activeFocus === "cardBrand" ? (
        <input
          type="text"
          value={page.paymentMockCardBrand ?? ""}
          maxLength={16}
          onChange={(e) =>
            onPatch({
              paymentMockCardBrand: e.target.value.slice(0, 16),
            })
          }
          className="w-full rounded-xl border border-zinc-200/90 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm ring-1 ring-zinc-950/[0.03] outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/12"
        />
      ) : null}
      {activeFocus === "expiry" ? (
        <input
          type="text"
          value={page.paymentMockExpiry ?? ""}
          maxLength={12}
          onChange={(e) =>
            onPatch({
              paymentMockExpiry: e.target.value.slice(0, 12),
            })
          }
          className="w-full rounded-xl border border-zinc-200/90 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm ring-1 ring-zinc-950/[0.03] outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/12"
        />
      ) : null}
      {activeFocus === "cvc" ? (
        <input
          type="text"
          value={page.paymentMockCvc ?? ""}
          maxLength={8}
          onChange={(e) =>
            onPatch({
              paymentMockCvc: e.target.value.slice(0, 8),
            })
          }
          className="w-full rounded-xl border border-zinc-200/90 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm ring-1 ring-zinc-950/[0.03] outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/12"
        />
      ) : null}
      {activeFocus === "nameOnCard" ? (
        <input
          type="text"
          value={page.paymentMockNameOnCard ?? ""}
          maxLength={PAYMENT_MOCK_FIELD_MAX}
          onChange={(e) =>
            onPatch({
              paymentMockNameOnCard: e.target.value.slice(
                0,
                PAYMENT_MOCK_FIELD_MAX,
              ),
            })
          }
          className="w-full rounded-xl border border-zinc-200/90 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm ring-1 ring-zinc-950/[0.03] outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/12"
        />
      ) : null}
      {activeFocus === "country" ? (
        <input
          type="text"
          value={page.paymentMockCountry ?? ""}
          maxLength={PAYMENT_MOCK_FIELD_MAX}
          onChange={(e) =>
            onPatch({
              paymentMockCountry: e.target.value.slice(
                0,
                PAYMENT_MOCK_FIELD_MAX,
              ),
            })
          }
          className="w-full rounded-xl border border-zinc-200/90 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm ring-1 ring-zinc-950/[0.03] outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/12"
        />
      ) : null}
      {activeFocus === "saveLabel" ? (
        <input
          type="text"
          value={page.paymentMockSaveLabel ?? ""}
          maxLength={LANDING_SUBHEADLINE_MAX}
          onChange={(e) =>
            onPatch({
              paymentMockSaveLabel: e.target.value.slice(
                0,
                LANDING_SUBHEADLINE_MAX,
              ),
            })
          }
          className="w-full rounded-xl border border-zinc-200/90 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm ring-1 ring-zinc-950/[0.03] outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/12"
        />
      ) : null}
    </div>
  ) : null;

  return (
    <div className="flex min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-zinc-200/90 bg-gradient-to-b from-white via-white to-zinc-50/70 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.18)] ring-1 ring-zinc-950/[0.06]">
      <div
        className="flex shrink-0 gap-0.5 overflow-x-auto border-b border-zinc-200/80 bg-zinc-50/95 p-1.5 backdrop-blur-[2px]"
        role="tablist"
        aria-label="Payment page sections"
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
              Shown at the top of the checkout mock.
            </p>
            <textarea
              value={page.body}
              maxLength={LANDING_BODY_MAX}
              onChange={(e) =>
                onPatch({
                  body: e.target.value.slice(0, LANDING_BODY_MAX),
                })
              }
              rows={10}
              className="mt-2 w-full resize-y rounded-xl border border-zinc-200/90 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm ring-1 ring-zinc-950/[0.03] outline-none transition focus:border-zinc-300 focus:shadow-md focus:ring-2 focus:ring-zinc-900/12"
            />
          </label>
        ) : null}

        {paymentFocusIsCheckoutDetail(activeFocus) ? (
          <div>
            {layoutControls}
            <p className="mt-4 text-[0.65rem] font-semibold uppercase tracking-wide text-zinc-500">
              Checkout fields
            </p>
            <p className="mt-0.5 text-[0.65rem] leading-relaxed text-zinc-500">
              Tap a row, then edit below. The phone mock highlights the same
              block.
            </p>
            <div className="mt-2">{checkoutPreview}</div>
            {fieldEditor}
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
              Pay button
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
              className="mt-2 w-full rounded-xl border border-zinc-200/90 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm ring-1 ring-zinc-950/[0.03] outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/12"
            />
          </label>
        ) : null}
      </div>
    </div>
  );
}
