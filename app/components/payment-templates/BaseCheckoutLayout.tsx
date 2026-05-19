"use client";

import { CheckoutTemplateType } from "@/app/components/crm-template-editor/checkout-template-types";
import {
  AddressFieldsBlock,
  ContactFieldsBlock,
  CouponFieldBlock,
  OrderSummaryBlock,
  PreviewCardFields,
} from "@/app/components/payment-templates/shared/CheckoutBlocks";
import { checkoutFormRootClass } from "@/app/components/payment-templates/shared/checkout-form-classes";
import type { CheckoutTemplateProps } from "@/app/components/payment-templates/types";

type LayoutVariant = CheckoutTemplateType;

function usesTwoColumnSummary(variant: LayoutVariant, showSummary: boolean) {
  if (!showSummary) return false;
  return (
    variant === CheckoutTemplateType.SPLIT ||
    variant === CheckoutTemplateType.SHOPIFY ||
    variant === CheckoutTemplateType.STRIPE ||
    variant === CheckoutTemplateType.PREMIUM ||
    variant === CheckoutTemplateType.CRM
  );
}

function shellForVariant(
  variant: LayoutVariant,
  page: CheckoutTemplateProps["page"],
  landingBlend?: CheckoutTemplateProps["landingBlend"],
) {
  if (landingBlend) {
    return {
      outer: "w-full min-w-0",
      inner: landingBlend.isDark
        ? "w-full min-w-0 rounded-2xl border border-white/10 bg-zinc-950/60 p-4 backdrop-blur-sm sm:p-5"
        : "w-full min-w-0 rounded-2xl border border-zinc-200/90 bg-white/95 p-4 shadow-sm sm:p-5",
      dark: landingBlend.isDark,
      bg: undefined as string | undefined,
      radius: undefined as string | undefined,
    };
  }

  const t = page.checkoutTheme;
  const bg = page.backgroundColor?.trim() || t.background;
  const radius = t.borderRadius;

  switch (variant) {
    case CheckoutTemplateType.DARK:
      return {
        outer: "w-full min-w-0 bg-zinc-950 text-white",
        inner:
          "w-full min-w-0 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 shadow-2xl shadow-black/40 sm:p-5",
        dark: true,
        bg: "#09090b",
      };
    case CheckoutTemplateType.FLOATING:
      return {
        outer:
          "w-full min-w-0 bg-gradient-to-br from-violet-100 via-white to-sky-100 p-3 sm:p-4",
        inner:
          "mx-auto w-full min-w-0 max-w-lg rounded-3xl border border-white/60 bg-white/80 p-4 shadow-2xl backdrop-blur-xl sm:p-6",
        dark: false,
        bg,
      };
    case CheckoutTemplateType.APPLE:
      return {
        outer: "w-full min-w-0 bg-zinc-100 p-2 sm:p-3",
        inner:
          "mx-auto w-full min-w-0 max-w-md rounded-[1.75rem] bg-white p-4 shadow-xl ring-1 ring-black/5 sm:p-6",
        dark: false,
        bg: "#f4f4f5",
      };
    case CheckoutTemplateType.MINIMAL:
      return {
        outer: "w-full min-w-0 bg-white",
        inner: "mx-auto w-full min-w-0 max-w-md p-3 sm:p-4",
        dark: false,
        bg: "#ffffff",
      };
    case CheckoutTemplateType.PREMIUM:
      return {
        outer:
          "w-full min-w-0 bg-gradient-to-b from-zinc-900 via-zinc-900 to-violet-950 p-3 sm:p-4",
        inner:
          "w-full min-w-0 rounded-2xl border border-white/10 bg-white/95 p-4 shadow-2xl sm:p-6",
        dark: false,
        bg,
      };
    default:
      return {
        outer: "w-full min-w-0",
        inner:
          "w-full min-w-0 rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-lg ring-1 ring-zinc-950/[0.04] sm:p-5",
        dark: false,
        bg,
        radius,
      };
  }
}

export function BaseCheckoutLayout({
  variant,
  page,
  landingPage,
  interactive,
  stripeCheckout,
  paymentSlot,
  campaignPricing,
  landingBlend = null,
  formStyles,
}: CheckoutTemplateProps & { variant: LayoutVariant }) {
  const styles = shellForVariant(variant, page, landingBlend);
  const dark = landingBlend ? formStyles.isDark : styles.dark || formStyles.isDark;
  const email = stripeCheckout?.customerEmail;
  const intro = page.subheading?.trim();
  const stripeMode = Boolean(interactive && stripeCheckout);
  const twoColumn =
    !landingBlend && usesTwoColumnSummary(variant, page.showOrderSummary);

  const formColumn = (
    <div
      className={[checkoutFormRootClass, formStyles.shellClass, "space-y-5"]
        .filter(Boolean)
        .join(" ")}
    >
      <div>
        <h2
          className={`text-left text-lg font-bold tracking-tight ${dark ? "text-white" : "text-zinc-900"}`}
        >
          {page.heading}
        </h2>
        {intro ? (
          <p
            className={`mt-1 text-left text-sm leading-snug ${dark ? "text-zinc-400" : "text-zinc-600"}`}
          >
            {intro}
          </p>
        ) : null}
      </div>

      <CouponFieldBlock
        page={page}
        interactive={interactive}
        formStyles={formStyles}
      />

      <ContactFieldsBlock
        page={page}
        interactive={interactive}
        customerEmail={email}
        formStyles={formStyles}
      />

      <AddressFieldsBlock
        page={page}
        interactive={interactive}
        formStyles={formStyles}
      />

      <div className="min-w-0">
        {stripeMode ? (
          paymentSlot
        ) : (
          <>
            <PreviewCardFields page={page} formStyles={formStyles} />
            <button
              type="button"
              style={{
                backgroundColor: page.checkoutTheme.buttonColor,
                borderRadius: page.checkoutTheme.borderRadius,
                boxShadow: page.checkoutTheme.shadow,
              }}
              className="mt-4 w-full cursor-pointer py-3.5 text-sm font-semibold text-white transition hover:brightness-110"
            >
              {page.buttonText || "Submit payment"}
            </button>
          </>
        )}
      </div>

      <p
        className={`text-center text-[0.65rem] ${dark ? "text-zinc-500" : "text-zinc-500"}`}
      >
        {page.paymentFooterText?.trim() || (
          <>
            Powered by <span className="font-semibold">stripe</span>
          </>
        )}
      </p>
    </div>
  );

  const summary = page.showOrderSummary ? (
    <div
      className={
        landingBlend
          ? "w-full min-w-0"
          : "min-w-0 shrink-0 @md:max-w-[42%] @md:flex-none"
      }
    >
      <OrderSummaryBlock
        page={page}
        landingPage={landingPage}
        campaignPricing={campaignPricing}
        dark={dark}
      />
    </div>
  ) : null;

  const stackClass = twoColumn
    ? "flex w-full min-w-0 flex-col gap-6 @md:flex-row @md:items-start @md:gap-5"
    : "flex w-full min-w-0 flex-col gap-6";

  return (
    <div
      className={`@container ${styles.outer} ${landingBlend ? checkoutFormRootClass : ""}`}
      style={styles.bg ? { backgroundColor: styles.bg } : undefined}
    >
      <div
        className={styles.inner}
        style={
          landingBlend
            ? undefined
            : {
                borderRadius: styles.radius ?? page.checkoutTheme.borderRadius,
                boxShadow: page.checkoutTheme.shadow,
              }
        }
      >
        <div className={stackClass}>
          {variant === CheckoutTemplateType.SPLIT && summary ? (
            <>
              {formColumn}
              {summary}
            </>
          ) : (
            <>
              {summary}
              {formColumn}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
