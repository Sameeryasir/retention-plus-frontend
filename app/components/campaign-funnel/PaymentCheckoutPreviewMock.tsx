"use client";

import { Fragment } from "react";
import { CreditCard, Mail, User } from "lucide-react";
import type { FunnelPage } from "@/app/components/campaign-funnel/funnel-data";
import {
  normalizePaymentCheckoutLayout,
  PAYMENT_CHECKOUT_SECTION_ORDER,
  type PaymentCheckoutLayout,
  type PaymentCheckoutSectionKey,
} from "@/app/components/campaign-funnel/funnel-data";
import type { PaymentSidebarFocus } from "@/app/components/campaign-funnel/PaymentFunnelEditSidebar";
import {
  LANDING_BODY_MAX,
  LANDING_CTA_MAX,
  LANDING_HEADLINE_MAX,
  LANDING_SUBHEADLINE_MAX,
  PAYMENT_MOCK_CARD_NUMBER_MAX,
  PAYMENT_MOCK_FIELD_MAX,
} from "@/app/components/campaign-funnel/funnel-limits";

export function PaymentCheckoutPreviewMock({
  page,
  heroImageSrc,
  editable = false,
  /** Same shell as landing/signup public routes: full viewport + narrow white column. */
  fullPage = false,
  paymentEditInSidebar = false,
  activePaymentFocus,
  onSelectPaymentFocus,
  onPatch,
}: {
  page: FunnelPage;
  heroImageSrc?: string | null;
  editable?: boolean;
  fullPage?: boolean;
  paymentEditInSidebar?: boolean;
  activePaymentFocus?: PaymentSidebarFocus;
  onSelectPaymentFocus?: (f: PaymentSidebarFocus) => void;
  onPatch?: (patch: Partial<FunnelPage>) => void;
}) {
  const sidebarTap = Boolean(
    editable && paymentEditInSidebar && onSelectPaymentFocus,
  );
  const patch = sidebarTap ? undefined : onPatch;

  const layout: PaymentCheckoutLayout = normalizePaymentCheckoutLayout(
    page.paymentCheckoutLayout,
  );
  const sectionOrder = PAYMENT_CHECKOUT_SECTION_ORDER[layout];
  const contactInline = layout === "contact_inline";

  const ringIf = (f: PaymentSidebarFocus) =>
    sidebarTap && activePaymentFocus === f
      ? "ring-2 ring-amber-400 ring-offset-1 ring-offset-white"
      : "";

  const introFallback =
    "We'll send your confirmation immediately after you get your deal.";
  const lineFallback = "$6 Crispy Spicy Salted Wings";
  const payLinkFallback = "Pay with link";

  const primaryBtnRing = `w-full rounded-md py-2 text-center text-[0.68rem] font-semibold outline-none transition ${
    sidebarTap && activePaymentFocus === "cta"
      ? "bg-black text-white ring-2 ring-amber-400 ring-offset-2 ring-offset-white"
      : "bg-black text-white shadow-sm hover:bg-zinc-900"
  }`;

  const primaryBtnFullPage = `w-full rounded-lg bg-zinc-900 py-2.5 text-center text-xs font-semibold tracking-wide text-white shadow-sm ring-1 ring-zinc-950/20 outline-none transition hover:bg-zinc-800 ${
    sidebarTap && activePaymentFocus === "cta"
      ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-white"
      : ""
  }`;

  const renderSection = (key: PaymentCheckoutSectionKey) => {
    switch (key) {
      case "intro":
        return (
          <>
            {editable && patch ? (
              <textarea
                value={page.body}
                maxLength={LANDING_BODY_MAX}
                onChange={(e) =>
                  patch({ body: e.target.value.slice(0, LANDING_BODY_MAX) })
                }
                rows={3}
                placeholder={introFallback}
                className="w-full resize-y rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-center text-[0.58rem] leading-relaxed text-zinc-700 outline-none focus:border-zinc-300 focus:bg-white focus:ring-1 focus:ring-zinc-900/10"
              />
            ) : sidebarTap ? (
              <button
                type="button"
                onClick={() => onSelectPaymentFocus?.("intro")}
                className={`w-full rounded-md px-1 py-1 text-center outline-none transition focus-visible:ring-2 focus-visible:ring-amber-400 ${ringIf("intro")}`}
              >
                <p className="text-[0.58rem] leading-relaxed text-zinc-500">
                  {page.body.trim() || introFallback}
                </p>
              </button>
            ) : (
              <p className="text-center text-[0.58rem] leading-relaxed text-zinc-500">
                {page.body.trim() || introFallback}
              </p>
            )}
          </>
        );
      case "deal":
        return (
          <div
            className={`flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/80 p-1.5 transition ${ringIf("lineItem")}`}
          >
            {heroImageSrc ? (
              <img
                src={heroImageSrc}
                alt=""
                className="size-8 shrink-0 rounded object-cover"
              />
            ) : (
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded bg-zinc-200 text-[0.55rem] text-zinc-500"
                aria-hidden
              >
                …
              </span>
            )}
            {editable && patch ? (
              <input
                type="text"
                value={page.headline}
                maxLength={LANDING_HEADLINE_MAX}
                onChange={(e) =>
                  patch({
                    headline: e.target.value.slice(0, LANDING_HEADLINE_MAX),
                  })
                }
                placeholder={lineFallback}
                className="min-w-0 flex-1 rounded border border-transparent bg-transparent text-[0.62rem] font-semibold text-zinc-900 outline-none focus:border-zinc-200 focus:bg-white/80"
              />
            ) : sidebarTap ? (
              <button
                type="button"
                onClick={() => onSelectPaymentFocus?.("lineItem")}
                className="min-w-0 flex-1 cursor-pointer rounded border border-transparent px-0.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <span className="font-semibold text-zinc-900">
                  {page.headline.trim() || lineFallback}
                </span>
              </button>
            ) : (
              <span className="min-w-0 font-semibold text-zinc-900">
                {page.headline.trim() || lineFallback}
              </span>
            )}
          </div>
        );
      case "currency":
        return (
          <div>
            <p className="mb-1 font-semibold text-zinc-700">Choose a currency:</p>
            <div className="flex gap-1.5">
              <button
                type="button"
                className="flex flex-1 flex-col items-center rounded-md border-2 border-zinc-900 bg-white py-1.5"
              >
                <span className="text-[0.55rem]" aria-hidden>
                  🇵🇰
                </span>
                <span className="font-medium text-zinc-900">PKR 1,738.64</span>
              </button>
              <button
                type="button"
                className="flex flex-1 flex-col items-center rounded-md border border-zinc-200 bg-white py-1.5"
              >
                <span className="text-[0.55rem]" aria-hidden>
                  🇺🇸
                </span>
                <span className="text-zinc-600">US$6.00</span>
              </button>
            </div>
            <p className="mt-0.5 text-center text-[0.55rem] text-zinc-400">
              1 USD (289.7733 PKR)
            </p>
          </div>
        );
      case "payLink":
        return (
          <>
            {editable && patch ? (
              <input
                type="text"
                value={page.subheadline}
                maxLength={LANDING_SUBHEADLINE_MAX}
                onChange={(e) =>
                  patch({
                    subheadline: e.target.value.slice(
                      0,
                      LANDING_SUBHEADLINE_MAX,
                    ),
                  })
                }
                placeholder={payLinkFallback}
                className="w-full rounded-md bg-black py-2 text-center text-[0.65rem] font-semibold text-white outline-none ring-white/30 placeholder:text-zinc-500 focus:ring-2"
              />
            ) : sidebarTap ? (
              <button
                type="button"
                onClick={() => onSelectPaymentFocus?.("payLink")}
                className={`w-full rounded-md bg-black py-2 text-center text-[0.65rem] font-semibold text-white outline-none transition focus-visible:ring-2 focus-visible:ring-amber-400 ${ringIf("payLink")}`}
              >
                {page.subheadline.trim() || payLinkFallback}
              </button>
            ) : (
              <button
                type="button"
                className="w-full rounded-md bg-black py-2 text-center text-[0.65rem] font-semibold text-white shadow-sm transition hover:bg-zinc-900"
              >
                {page.subheadline.trim() || payLinkFallback}
              </button>
            )}
          </>
        );
      case "or":
        return (
          <div className="py-1 text-center">
            <p className="text-[0.55rem] text-zinc-400">OR</p>
          </div>
        );
      case "contactTitle":
        return (
          <>
            {editable && patch ? (
              <input
                type="text"
                value={page.paymentMockContactTitle ?? ""}
                maxLength={PAYMENT_MOCK_FIELD_MAX}
                onChange={(e) =>
                  patch({
                    paymentMockContactTitle: e.target.value.slice(
                      0,
                      PAYMENT_MOCK_FIELD_MAX,
                    ),
                  })
                }
                placeholder="Contact details"
                className="w-full rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-[0.62rem] font-bold text-zinc-900 outline-none focus:border-zinc-300 focus:bg-white"
              />
            ) : sidebarTap ? (
              <button
                type="button"
                onClick={() => onSelectPaymentFocus?.("contactTitle")}
                className={`w-full cursor-pointer rounded border border-transparent px-0.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${ringIf("contactTitle")}`}
              >
                <p className="text-[0.62rem] font-bold text-zinc-900">
                  {page.paymentMockContactTitle?.trim() || "Contact details"}
                </p>
              </button>
            ) : (
              <p className="text-[0.62rem] font-bold text-zinc-900">
                {page.paymentMockContactTitle?.trim() || "Contact details"}
              </p>
            )}
          </>
        );
      case "contactFields": {
        const emailRow = (
          <div
            className={`flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2 py-1.5 transition ${ringIf("email")} ${contactInline ? "min-w-0" : ""}`}
          >
            <Mail className="size-3 shrink-0 text-zinc-400" aria-hidden strokeWidth={2} />
            {editable && patch ? (
              <input
                type="text"
                value={page.paymentMockEmail ?? ""}
                maxLength={PAYMENT_MOCK_FIELD_MAX}
                onChange={(e) =>
                  patch({
                    paymentMockEmail: e.target.value.slice(
                      0,
                      PAYMENT_MOCK_FIELD_MAX,
                    ),
                  })
                }
                placeholder="email@example.com"
                className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[0.62rem] text-zinc-800 outline-none placeholder:text-zinc-400"
              />
            ) : sidebarTap ? (
              <button
                type="button"
                onClick={() => onSelectPaymentFocus?.("email")}
                className="min-w-0 flex-1 cursor-pointer truncate rounded border border-transparent px-0.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-400"
              >
                <span className="text-zinc-400">
                  {page.paymentMockEmail?.trim() || "email@example.com"}
                </span>
              </button>
            ) : (
              <span className="text-zinc-400">
                {page.paymentMockEmail?.trim() || "email@example.com"}
              </span>
            )}
          </div>
        );
        const fullNameRow = (
          <div
            className={`flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2 py-1.5 transition ${ringIf("fullName")} ${contactInline ? "min-w-0" : ""}`}
          >
            <User className="size-3 shrink-0 text-zinc-400" aria-hidden strokeWidth={2} />
            {editable && patch ? (
              <input
                type="text"
                value={page.paymentMockFullName ?? ""}
                maxLength={PAYMENT_MOCK_FIELD_MAX}
                onChange={(e) =>
                  patch({
                    paymentMockFullName: e.target.value.slice(
                      0,
                      PAYMENT_MOCK_FIELD_MAX,
                    ),
                  })
                }
                placeholder="Full name"
                className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[0.62rem] text-zinc-800 outline-none placeholder:text-zinc-400"
              />
            ) : sidebarTap ? (
              <button
                type="button"
                onClick={() => onSelectPaymentFocus?.("fullName")}
                className="min-w-0 flex-1 cursor-pointer truncate rounded border border-transparent px-0.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-400"
              >
                <span className="text-zinc-400">
                  {page.paymentMockFullName?.trim() || "Full name"}
                </span>
              </button>
            ) : (
              <span className="text-zinc-400">
                {page.paymentMockFullName?.trim() || "Full name"}
              </span>
            )}
          </div>
        );
        const phoneRow = (
          <div
            className={`flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2 py-1.5 transition ${ringIf("contactPhone")}`}
          >
            <span className="text-[0.55rem]" aria-hidden>
              🇵🇰
            </span>
            {editable && patch ? (
              <input
                type="text"
                value={page.paymentMockPhone ?? ""}
                maxLength={PAYMENT_MOCK_FIELD_MAX}
                onChange={(e) =>
                  patch({
                    paymentMockPhone: e.target.value.slice(
                      0,
                      PAYMENT_MOCK_FIELD_MAX,
                    ),
                  })
                }
                placeholder="0301 2345678"
                className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[0.62rem] text-zinc-800 outline-none placeholder:text-zinc-400"
              />
            ) : sidebarTap ? (
              <button
                type="button"
                onClick={() => onSelectPaymentFocus?.("contactPhone")}
                className="min-w-0 flex-1 cursor-pointer truncate rounded border border-transparent px-0.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-400"
              >
                <span className="text-zinc-400">
                  {page.paymentMockPhone?.trim() || "0301 2345678"}
                </span>
              </button>
            ) : (
              <span className="text-zinc-400">
                {page.paymentMockPhone?.trim() || "0301 2345678"}
              </span>
            )}
          </div>
        );
        if (contactInline) {
          return (
            <div className="space-y-1.5">
              <div className="grid grid-cols-2 gap-1.5">
                {emailRow}
                {fullNameRow}
              </div>
              {phoneRow}
            </div>
          );
        }
        return (
          <div className="space-y-1.5">
            {emailRow}
            {fullNameRow}
            {phoneRow}
          </div>
        );
      }
      case "methodTitle":
        return (
          <>
            {editable && patch ? (
              <input
                type="text"
                value={page.paymentMockMethodTitle ?? ""}
                maxLength={PAYMENT_MOCK_FIELD_MAX}
                onChange={(e) =>
                  patch({
                    paymentMockMethodTitle: e.target.value.slice(
                      0,
                      PAYMENT_MOCK_FIELD_MAX,
                    ),
                  })
                }
                placeholder="Payment method"
                className="w-full rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-[0.62rem] font-bold text-zinc-900 outline-none focus:border-zinc-300 focus:bg-white"
              />
            ) : sidebarTap ? (
              <button
                type="button"
                onClick={() => onSelectPaymentFocus?.("methodTitle")}
                className={`w-full cursor-pointer rounded border border-transparent px-0.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${ringIf("methodTitle")}`}
              >
                <p className="text-[0.62rem] font-bold text-zinc-900">
                  {page.paymentMockMethodTitle?.trim() || "Payment method"}
                </p>
              </button>
            ) : (
              <p className="text-[0.62rem] font-bold text-zinc-900">
                {page.paymentMockMethodTitle?.trim() || "Payment method"}
              </p>
            )}
          </>
        );
      case "cardBlock":
        return (
          <div
            className={`space-y-1.5 rounded-md border border-zinc-200 bg-white p-1.5 transition ${
              sidebarTap &&
              (activePaymentFocus === "cardNumber" ||
                activePaymentFocus === "cardBrand")
                ? "ring-2 ring-amber-400 ring-offset-1 ring-offset-white"
                : ""
            }`}
          >
            <div className="flex items-center gap-1 pb-1.5">
              <CreditCard className="size-3 shrink-0 text-zinc-400" aria-hidden strokeWidth={2} />
              {editable && patch ? (
                <input
                  type="text"
                  value={page.paymentMockCardNumber ?? ""}
                  maxLength={PAYMENT_MOCK_CARD_NUMBER_MAX}
                  onChange={(e) =>
                    patch({
                      paymentMockCardNumber: e.target.value.slice(
                        0,
                        PAYMENT_MOCK_CARD_NUMBER_MAX,
                      ),
                    })
                  }
                  placeholder="1234 1234 1234 1234"
                  className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[0.62rem] text-zinc-800 outline-none placeholder:text-zinc-400"
                />
              ) : sidebarTap ? (
                <button
                  type="button"
                  onClick={() => onSelectPaymentFocus?.("cardNumber")}
                  className="min-w-0 flex-1 cursor-pointer truncate rounded border border-transparent px-0.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-400"
                >
                  <span className="text-zinc-400">
                    {page.paymentMockCardNumber?.trim() ||
                      "1234 1234 1234 1234"}
                  </span>
                </button>
              ) : (
                <span className="min-w-0 flex-1 text-zinc-400">
                  {page.paymentMockCardNumber?.trim() ||
                    "1234 1234 1234 1234"}
                </span>
              )}
              {editable && patch ? (
                <input
                  type="text"
                  value={page.paymentMockCardBrand ?? ""}
                  maxLength={16}
                  onChange={(e) =>
                    patch({
                      paymentMockCardBrand: e.target.value.slice(0, 16),
                    })
                  }
                  placeholder="Visa"
                  className="w-12 shrink-0 border-0 bg-transparent p-0 text-right text-[0.5rem] text-zinc-600 outline-none placeholder:text-zinc-300"
                />
              ) : sidebarTap ? (
                <button
                  type="button"
                  onClick={() => onSelectPaymentFocus?.("cardBrand")}
                  className="w-12 shrink-0 cursor-pointer rounded border border-transparent px-0.5 text-right outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-400"
                >
                  <span className="text-[0.5rem] text-zinc-300">
                    {page.paymentMockCardBrand?.trim() || "Visa"}
                  </span>
                </button>
              ) : (
                <span className="shrink-0 text-[0.5rem] text-zinc-300">
                  {page.paymentMockCardBrand?.trim() || "Visa"}
                </span>
              )}
            </div>
            <div className="flex gap-1.5">
              {editable && patch ? (
                <>
                  <input
                    type="text"
                    value={page.paymentMockExpiry ?? ""}
                    maxLength={12}
                    onChange={(e) =>
                      patch({
                        paymentMockExpiry: e.target.value.slice(0, 12),
                      })
                    }
                    placeholder="MM / YY"
                    className="min-w-0 flex-1 rounded border border-zinc-100 px-1.5 py-1 text-[0.62rem] text-zinc-800 outline-none focus:border-zinc-200"
                  />
                  <input
                    type="text"
                    value={page.paymentMockCvc ?? ""}
                    maxLength={8}
                    onChange={(e) =>
                      patch({
                        paymentMockCvc: e.target.value.slice(0, 8),
                      })
                    }
                    placeholder="CVC"
                    className="min-w-0 flex-1 rounded border border-zinc-100 px-1.5 py-1 text-[0.62rem] text-zinc-800 outline-none focus:border-zinc-200"
                  />
                </>
              ) : sidebarTap ? (
                <>
                  <button
                    type="button"
                    onClick={() => onSelectPaymentFocus?.("expiry")}
                    className={`min-w-0 flex-1 cursor-pointer rounded border border-zinc-100 px-1.5 py-1 text-left text-zinc-400 outline-none transition focus-visible:ring-2 focus-visible:ring-amber-400 ${ringIf("expiry")}`}
                  >
                    {page.paymentMockExpiry?.trim() || "MM / YY"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectPaymentFocus?.("cvc")}
                    className={`min-w-0 flex-1 cursor-pointer rounded border border-zinc-100 px-1.5 py-1 text-left text-zinc-400 outline-none transition focus-visible:ring-2 focus-visible:ring-amber-400 ${ringIf("cvc")}`}
                  >
                    {page.paymentMockCvc?.trim() || "CVC"}
                  </button>
                </>
              ) : (
                <>
                  <div className="flex-1 rounded border border-zinc-100 px-1.5 py-1 text-zinc-400">
                    {page.paymentMockExpiry?.trim() || "MM / YY"}
                  </div>
                  <div className="flex-1 rounded border border-zinc-100 px-1.5 py-1 text-zinc-400">
                    {page.paymentMockCvc?.trim() || "CVC"}
                  </div>
                </>
              )}
            </div>
          </div>
        );
      case "billingExtra":
        return (
          <div className="space-y-1.5">
            {editable && patch ? (
              <input
                type="text"
                value={page.paymentMockNameOnCard ?? ""}
                maxLength={PAYMENT_MOCK_FIELD_MAX}
                onChange={(e) =>
                  patch({
                    paymentMockNameOnCard: e.target.value.slice(
                      0,
                      PAYMENT_MOCK_FIELD_MAX,
                    ),
                  })
                }
                placeholder="Full name on card"
                className="w-full rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-[0.62rem] text-zinc-800 outline-none focus:border-zinc-300"
              />
            ) : sidebarTap ? (
              <button
                type="button"
                onClick={() => onSelectPaymentFocus?.("nameOnCard")}
                className={`w-full cursor-pointer rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-left text-zinc-400 outline-none transition focus-visible:ring-2 focus-visible:ring-amber-400 ${ringIf("nameOnCard")}`}
              >
                {page.paymentMockNameOnCard?.trim() || "Full name on card"}
              </button>
            ) : (
              <div className="rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-zinc-400">
                {page.paymentMockNameOnCard?.trim() || "Full name on card"}
              </div>
            )}
            {editable && patch ? (
              <input
                type="text"
                value={page.paymentMockCountry ?? ""}
                maxLength={PAYMENT_MOCK_FIELD_MAX}
                onChange={(e) =>
                  patch({
                    paymentMockCountry: e.target.value.slice(
                      0,
                      PAYMENT_MOCK_FIELD_MAX,
                    ),
                  })
                }
                placeholder="Pakistan ▾"
                className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-[0.62rem] text-zinc-800 outline-none focus:border-zinc-300"
              />
            ) : sidebarTap ? (
              <button
                type="button"
                onClick={() => onSelectPaymentFocus?.("country")}
                className={`w-full cursor-pointer rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-left text-zinc-700 outline-none transition focus-visible:ring-2 focus-visible:ring-amber-400 ${ringIf("country")}`}
              >
                {page.paymentMockCountry?.trim() || "Pakistan ▾"}
              </button>
            ) : (
              <div className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-zinc-700">
                {page.paymentMockCountry?.trim() || "Pakistan ▾"}
              </div>
            )}
            <label
              className={`flex cursor-default items-start gap-2 pt-0.5 transition ${ringIf("saveLabel")}`}
            >
              <span
                className="mt-0.5 inline-flex size-3 shrink-0 rounded border border-zinc-300 bg-white"
                aria-hidden
              />
              {editable && patch ? (
                <input
                  type="text"
                  value={page.paymentMockSaveLabel ?? ""}
                  maxLength={LANDING_SUBHEADLINE_MAX}
                  onChange={(e) =>
                    patch({
                      paymentMockSaveLabel: e.target.value.slice(
                        0,
                        LANDING_SUBHEADLINE_MAX,
                      ),
                    })
                  }
                  placeholder="Save my information for faster checkout"
                  className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[0.55rem] leading-relaxed text-zinc-700 outline-none placeholder:text-zinc-400"
                />
              ) : sidebarTap ? (
                <button
                  type="button"
                  onClick={() => onSelectPaymentFocus?.("saveLabel")}
                  className="min-w-0 flex-1 cursor-pointer rounded border border-transparent px-0.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-400"
                >
                  <span className="text-[0.55rem] leading-relaxed text-zinc-500">
                    {page.paymentMockSaveLabel?.trim() ||
                      "Save my information for faster checkout"}
                  </span>
                </button>
              ) : (
                <span className="text-[0.55rem] leading-relaxed text-zinc-500">
                  {page.paymentMockSaveLabel?.trim() ||
                    "Save my information for faster checkout"}
                </span>
              )}
            </label>
          </div>
        );
      default:
        return null;
    }
  };

  const scrollBody = (
    <div
      className={
        fullPage
          ? "min-h-0 flex-1 space-y-2.5 overflow-y-auto overscroll-contain px-4 py-4 text-[0.62rem] leading-snug text-zinc-800 sm:px-6 sm:py-5"
          : "min-h-0 flex-1 space-y-2.5 overflow-y-auto overscroll-contain px-3 py-3 text-[0.62rem] leading-snug text-zinc-800"
      }
    >
      {sectionOrder.map((key) => (
        <Fragment key={key}>{renderSection(key)}</Fragment>
      ))}
    </div>
  );

  const payFooter = (
    <div
      className={
        fullPage
          ? "shrink-0 bg-white px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-4"
          : "shrink-0 bg-white px-3 py-2.5"
      }
    >
      {editable && patch ? (
        <input
          type="text"
          value={page.ctaLabel}
          maxLength={LANDING_CTA_MAX}
          onChange={(e) =>
            patch({
              ctaLabel: e.target.value.slice(0, LANDING_CTA_MAX),
            })
          }
          placeholder="Pay"
          aria-label="Submit payment button label"
          className={
            fullPage
              ? "w-full rounded-lg border border-zinc-900 bg-zinc-900 py-2.5 text-center text-xs font-semibold tracking-wide text-white outline-none ring-zinc-950/20 placeholder:text-zinc-500 focus:ring-2 focus:ring-white/30"
              : "w-full rounded-md border border-zinc-900 bg-black py-2 text-center text-[0.68rem] font-semibold text-white outline-none ring-white/30 placeholder:text-zinc-500 focus:ring-2"
          }
        />
      ) : sidebarTap ? (
        <button
          type="button"
          onClick={() => onSelectPaymentFocus?.("cta")}
          aria-label="Edit pay button in panel"
          className={fullPage ? primaryBtnFullPage : primaryBtnRing}
        >
          {page.ctaLabel.trim() || "Pay"}
        </button>
      ) : (
        <button
          type="button"
          className={
            fullPage
              ? primaryBtnFullPage
              : "w-full rounded-md bg-black py-2 text-center text-[0.68rem] font-semibold text-white shadow-sm transition hover:bg-zinc-900"
          }
        >
          {page.ctaLabel.trim() || "Pay"}
        </button>
      )}
      <p
        className={
          fullPage
            ? "mt-2 text-center text-[0.55rem] text-zinc-400"
            : "mt-1.5 text-center text-[0.5rem] text-zinc-400"
        }
      >
        Powered by <span className="font-semibold text-zinc-600">stripe</span>
      </p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-dvh w-full bg-zinc-100">
        <div className="mx-auto flex min-h-dvh w-full max-w-[20rem] flex-col bg-white shadow-sm ring-1 ring-black/5">
          <div className="flex min-h-0 w-full flex-1 flex-col bg-white">
            {scrollBody}
            {payFooter}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex max-h-[min(72dvh,30rem)] min-h-0 flex-col overflow-hidden bg-zinc-100 sm:max-h-[min(80dvh,38rem)]">
      <div className="mx-1 mt-1 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-sm">
        {scrollBody}
        {payFooter}
      </div>
    </div>
  );
}
