"use client";

import { CreditCard, Mail, User } from "lucide-react";
import type { FunnelPage } from "@/app/components/campaign-funnel/funnel-data";
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
  onPatch,
}: {
  page: FunnelPage;
  heroImageSrc?: string | null;
  editable?: boolean;
  onPatch?: (patch: Partial<FunnelPage>) => void;
}) {
  const introFallback =
    "We'll send your confirmation immediately after you get your deal.";
  const lineFallback = "$6 Crispy Spicy Salted Wings";
  const payLinkFallback = "Pay with link";

  return (
    <div className="flex max-h-[min(72dvh,30rem)] min-h-0 flex-col overflow-hidden bg-zinc-100 sm:max-h-[min(80dvh,38rem)]">
      <div className="mx-1 mt-1 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-sm">
        <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto overscroll-contain px-3 py-3 text-[0.62rem] leading-snug text-zinc-800">
          {editable && onPatch ? (
            <textarea
              value={page.body}
              maxLength={LANDING_BODY_MAX}
              onChange={(e) =>
                onPatch({ body: e.target.value.slice(0, LANDING_BODY_MAX) })
              }
              rows={3}
              placeholder={introFallback}
              className="w-full resize-y rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-center text-[0.58rem] leading-relaxed text-zinc-700 outline-none focus:border-zinc-300 focus:bg-white focus:ring-1 focus:ring-zinc-900/10"
            />
          ) : (
            <p className="text-center text-[0.58rem] leading-relaxed text-zinc-500">
              {page.body.trim() || introFallback}
            </p>
          )}
          <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/80 p-1.5">
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
            {editable && onPatch ? (
              <input
                type="text"
                value={page.headline}
                maxLength={LANDING_HEADLINE_MAX}
                onChange={(e) =>
                  onPatch({
                    headline: e.target.value.slice(0, LANDING_HEADLINE_MAX),
                  })
                }
                placeholder={lineFallback}
                className="min-w-0 flex-1 rounded border border-transparent bg-transparent text-[0.62rem] font-semibold text-zinc-900 outline-none focus:border-zinc-200 focus:bg-white/80"
              />
            ) : (
              <span className="min-w-0 font-semibold text-zinc-900">
                {page.headline.trim() || lineFallback}
              </span>
            )}
          </div>
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
          {editable && onPatch ? (
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
              placeholder={payLinkFallback}
              className="w-full rounded-md bg-black py-2 text-center text-[0.65rem] font-semibold text-white outline-none ring-white/30 placeholder:text-zinc-500 focus:ring-2"
            />
          ) : (
            <button
              type="button"
              className="w-full rounded-md bg-black py-2 text-center text-[0.65rem] font-semibold text-white shadow-sm transition hover:bg-zinc-900"
            >
              {page.subheadline.trim() || payLinkFallback}
            </button>
          )}
          <div className="relative py-1">
            <div className="absolute inset-x-0 top-1/2 border-t border-zinc-200" />
            <p className="relative mx-auto w-fit bg-white px-2 text-[0.55rem] text-zinc-400">
              OR
            </p>
          </div>
          {editable && onPatch ? (
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
              placeholder="Contact details"
              className="w-full rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-[0.62rem] font-bold text-zinc-900 outline-none focus:border-zinc-300 focus:bg-white"
            />
          ) : (
            <p className="text-[0.62rem] font-bold text-zinc-900">
              {page.paymentMockContactTitle?.trim() || "Contact details"}
            </p>
          )}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2 py-1.5">
              <Mail className="size-3 shrink-0 text-zinc-400" aria-hidden strokeWidth={2} />
              {editable && onPatch ? (
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
                  placeholder="email@example.com"
                  className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[0.62rem] text-zinc-800 outline-none placeholder:text-zinc-400"
                />
              ) : (
                <span className="text-zinc-400">
                  {page.paymentMockEmail?.trim() || "email@example.com"}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2 py-1.5">
              <User className="size-3 shrink-0 text-zinc-400" aria-hidden strokeWidth={2} />
              {editable && onPatch ? (
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
                  placeholder="Full name"
                  className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[0.62rem] text-zinc-800 outline-none placeholder:text-zinc-400"
                />
              ) : (
                <span className="text-zinc-400">
                  {page.paymentMockFullName?.trim() || "Full name"}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2 py-1.5">
              <span className="text-[0.55rem]" aria-hidden>
                🇵🇰
              </span>
              {editable && onPatch ? (
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
                  placeholder="0301 2345678"
                  className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[0.62rem] text-zinc-800 outline-none placeholder:text-zinc-400"
                />
              ) : (
                <span className="text-zinc-400">
                  {page.paymentMockPhone?.trim() || "0301 2345678"}
                </span>
              )}
            </div>
          </div>
          {editable && onPatch ? (
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
              placeholder="Payment method"
              className="w-full rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-[0.62rem] font-bold text-zinc-900 outline-none focus:border-zinc-300 focus:bg-white"
            />
          ) : (
            <p className="text-[0.62rem] font-bold text-zinc-900">
              {page.paymentMockMethodTitle?.trim() || "Payment method"}
            </p>
          )}
          <div className="space-y-1.5 rounded-md border border-zinc-200 bg-white p-1.5">
            <div className="flex items-center gap-1 border-b border-zinc-100 pb-1.5">
              <CreditCard className="size-3 shrink-0 text-zinc-400" aria-hidden strokeWidth={2} />
              {editable && onPatch ? (
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
                  placeholder="1234 1234 1234 1234"
                  className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[0.62rem] text-zinc-800 outline-none placeholder:text-zinc-400"
                />
              ) : (
                <span className="min-w-0 flex-1 text-zinc-400">
                  {page.paymentMockCardNumber?.trim() ||
                    "1234 1234 1234 1234"}
                </span>
              )}
              {editable && onPatch ? (
                <input
                  type="text"
                  value={page.paymentMockCardBrand ?? ""}
                  maxLength={16}
                  onChange={(e) =>
                    onPatch({
                      paymentMockCardBrand: e.target.value.slice(0, 16),
                    })
                  }
                  placeholder="Visa"
                  className="w-12 shrink-0 border-0 bg-transparent p-0 text-right text-[0.5rem] text-zinc-600 outline-none placeholder:text-zinc-300"
                />
              ) : (
                <span className="shrink-0 text-[0.5rem] text-zinc-300">
                  {page.paymentMockCardBrand?.trim() || "Visa"}
                </span>
              )}
            </div>
            <div className="flex gap-1.5">
              {editable && onPatch ? (
                <>
                  <input
                    type="text"
                    value={page.paymentMockExpiry ?? ""}
                    maxLength={12}
                    onChange={(e) =>
                      onPatch({
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
                      onPatch({
                        paymentMockCvc: e.target.value.slice(0, 8),
                      })
                    }
                    placeholder="CVC"
                    className="min-w-0 flex-1 rounded border border-zinc-100 px-1.5 py-1 text-[0.62rem] text-zinc-800 outline-none focus:border-zinc-200"
                  />
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
          {editable && onPatch ? (
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
              placeholder="Full name on card"
              className="w-full rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-[0.62rem] text-zinc-800 outline-none focus:border-zinc-300"
            />
          ) : (
            <div className="rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-zinc-400">
              {page.paymentMockNameOnCard?.trim() || "Full name on card"}
            </div>
          )}
          {editable && onPatch ? (
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
              placeholder="Pakistan ▾"
              className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-[0.62rem] text-zinc-800 outline-none focus:border-zinc-300"
            />
          ) : (
            <div className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-zinc-700">
              {page.paymentMockCountry?.trim() || "Pakistan ▾"}
            </div>
          )}
          <label className="flex cursor-default items-start gap-2 pt-0.5">
            <span
              className="mt-0.5 inline-flex size-3 shrink-0 rounded border border-zinc-300 bg-white"
              aria-hidden
            />
            {editable && onPatch ? (
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
                placeholder="Save my information for faster checkout"
                className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[0.55rem] leading-relaxed text-zinc-700 outline-none placeholder:text-zinc-400"
              />
            ) : (
              <span className="text-[0.55rem] leading-relaxed text-zinc-500">
                {page.paymentMockSaveLabel?.trim() ||
                  "Save my information for faster checkout"}
              </span>
            )}
          </label>
        </div>
        <div className="shrink-0 border-t border-zinc-100 bg-white px-3 py-2.5">
          {editable && onPatch ? (
            <input
              type="text"
              value={page.ctaLabel}
              maxLength={LANDING_CTA_MAX}
              onChange={(e) =>
                onPatch({
                  ctaLabel: e.target.value.slice(0, LANDING_CTA_MAX),
                })
              }
              placeholder="Pay"
              aria-label="Submit payment button label"
              className="w-full rounded-md border border-zinc-900 bg-black py-2 text-center text-[0.68rem] font-semibold text-white outline-none ring-white/30 placeholder:text-zinc-500 focus:ring-2"
            />
          ) : (
            <button
              type="button"
              className="w-full rounded-md bg-black py-2 text-center text-[0.68rem] font-semibold text-white shadow-sm transition hover:bg-zinc-900"
            >
              {page.ctaLabel.trim() || "Pay"}
            </button>
          )}
          <p className="mt-1.5 text-center text-[0.5rem] text-zinc-400">
            Powered by <span className="font-semibold text-zinc-600">stripe</span>
          </p>
        </div>
      </div>
    </div>
  );
}
