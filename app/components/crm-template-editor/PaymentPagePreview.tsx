"use client";

import type { HTMLAttributes } from "react";
import { useId } from "react";
import { CreditCard, Mail, User } from "lucide-react";
import { getFormFieldStyles } from "@/app/components/crm-template-editor/form-design-registry";
import {
  imageScaleStyle,
  normalizeImageScale,
} from "@/app/components/crm-template-editor/template-image";
import type {
  FormDesign,
  PaymentTemplatePage,
  TemplatePage,
} from "@/app/components/crm-template-editor/template-types";

function CheckoutFieldRow({
  label,
  design,
  interactive = false,
  inputName,
  type = "text",
  placeholder = "",
  autoComplete,
  inputMode,
  children,
}: {
  label: string;
  design: FormDesign;
  interactive?: boolean;
  inputName?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  children?: React.ReactNode;
}) {
  const rid = useId();
  const inputId = inputName ? `pay-${inputName}-${rid}` : `pay-field-${rid}`;
  const { label: labelCls, field: fieldCls } = getFormFieldStyles(design);
  const shellClass = `flex w-full min-h-10 items-center gap-2 px-3 text-sm ${interactive ? "text-zinc-900" : "text-zinc-400"} ${fieldCls}`;

  return (
    <div className="min-w-0 text-left">
      <label htmlFor={inputId} className={labelCls}>
        {label}
      </label>
      {interactive ? (
        <input
          id={inputId}
          name={inputName}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          className={`${shellClass} border-0 bg-transparent outline-none ring-0 placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-zinc-900/15`}
        />
      ) : (
        <div className={shellClass} aria-hidden>
          {children}
        </div>
      )}
    </div>
  );
}

export function PaymentPagePreview({
  page,
  landingPage,
  interactive = false,
}: {
  page: TemplatePage;
  landingPage: TemplatePage;
  interactive?: boolean;
}) {
  const p = page as PaymentTemplatePage;
  const design = p.formDesign;
  const { label: cardLabelCls, field: cardFieldCls } = getFormFieldStyles(design);
  const intro =
    p.subheading?.trim() ||
    "Use a saved card or enter a new one to finish checkout.";
  const summaryTitle = p.heading?.trim() || "Payment details";
  const submitLabel = p.buttonText?.trim() || "Submit payment";
  const thumbUrl = landingPage.imageUrl;
  const thumbScale = landingPage.imageScale;

  const emailPh = p.paymentEmailPlaceholder || "email@example.com";
  const namePh = p.paymentFullNamePlaceholder || "Full name";
  const phonePh = p.paymentPhonePlaceholder || "0301 2345678";
  const cardPh = p.paymentCardPlaceholder || "1234 1234 1234 1234";
  const expPh = p.paymentExpiryPlaceholder || "MM / YY";
  const cvcPh = p.paymentCvcPlaceholder || "CVC";
  const nameOnCardPh = p.paymentNameOnCardPlaceholder || "Full name on card";

  const cardShell = `flex w-full min-h-10 items-center justify-between gap-2 px-3 text-sm ${interactive ? "text-zinc-900" : "text-zinc-400"} ${cardFieldCls}`;
  const rid = useId();
  const cardInputId = `pay-cardnumber-${rid}`;

  const body = (
    <div className="space-y-4 text-left text-zinc-900">
      <p className="text-[0.8125rem] leading-snug text-zinc-600">{intro}</p>

      <div className="flex items-center gap-3 rounded-xl border-2 border-amber-400/90 bg-amber-50/40 p-2.5 pr-3">
        <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
          {thumbUrl?.trim() ? (
            <img
              src={thumbUrl}
              alt=""
              className="h-full w-full object-cover"
              style={imageScaleStyle(normalizeImageScale(thumbScale))}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[0.65rem] font-medium text-zinc-500">
              Img
            </div>
          )}
        </div>
        <span className="text-sm font-semibold text-zinc-900">{summaryTitle}</span>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold text-zinc-700">
          {p.paymentChooseCurrencyLabel || "Choose a currency:"}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="flex cursor-pointer flex-col rounded-lg border-2 border-zinc-900 bg-white px-2 py-2 text-left shadow-sm"
          >
            <span className="text-lg leading-none" aria-hidden>
              🇵🇰
            </span>
            <span className="mt-1 text-[0.65rem] font-bold text-zinc-900">PKR</span>
            <span className="text-[0.65rem] text-zinc-600">1,738.64</span>
          </button>
          <button
            type="button"
            className="flex cursor-pointer flex-col rounded-lg border border-zinc-200 bg-zinc-50/80 px-2 py-2 text-left"
          >
            <span className="text-lg leading-none" aria-hidden>
              🇺🇸
            </span>
            <span className="mt-1 text-[0.65rem] font-bold text-zinc-800">US$</span>
            <span className="text-[0.65rem] text-zinc-500">6.00</span>
          </button>
        </div>
        <p className="mt-1.5 text-[0.6rem] text-zinc-500">
          {p.paymentCurrencyRateHint || "1 USD (289.7733 PKR)"}
        </p>
      </div>

      <button
        type="button"
        className="w-full cursor-pointer rounded-lg bg-zinc-900 py-3 text-sm font-semibold text-white shadow-sm"
      >
        {p.payWithLinkText || "Pay with link"}
      </button>

      <div className="relative py-1 text-center">
        <span className="relative z-[1] bg-white px-2 text-[0.65rem] font-medium uppercase tracking-wide text-zinc-400">
          {p.checkoutDividerText || "or"}
        </span>
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-zinc-200" aria-hidden />
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold tracking-tight text-zinc-800">
          {p.contactSectionTitle || "Contact details"}
        </p>
        <div className="space-y-4">
          <CheckoutFieldRow
            design={design}
            label="Email"
            interactive={interactive}
            inputName="contactEmail"
            type="email"
            placeholder={emailPh}
            autoComplete="email"
          >
            <Mail className="size-4 shrink-0 text-zinc-400" strokeWidth={2} />
            <span className="min-w-0 truncate">{emailPh}</span>
          </CheckoutFieldRow>
          <CheckoutFieldRow
            design={design}
            label="Full name"
            interactive={interactive}
            inputName="contactFullName"
            placeholder={namePh}
            autoComplete="name"
          >
            <User className="size-4 shrink-0 text-zinc-400" strokeWidth={2} />
            <span className="min-w-0 truncate">{namePh}</span>
          </CheckoutFieldRow>
          <CheckoutFieldRow
            design={design}
            label="Phone number"
            interactive={interactive}
            inputName="contactPhone"
            type="tel"
            placeholder={phonePh}
            autoComplete="tel"
            inputMode="tel"
          >
            <span className="text-base leading-none text-zinc-500" aria-hidden>
              🇵🇰
            </span>
            <span className="min-w-0 truncate">{phonePh}</span>
          </CheckoutFieldRow>
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold tracking-tight text-zinc-800">
          {p.paymentMethodSectionTitle || "Payment method"}
        </p>
        <div className="space-y-4">
          <div className="min-w-0 text-left">
            <label htmlFor={cardInputId} className={cardLabelCls}>
              Card number
            </label>
            {interactive ? (
              <div
                className={`${cardShell} border-0 outline-none ring-0 focus-within:ring-2 focus-within:ring-zinc-900/15`}
              >
                <CreditCard
                  className="size-4 shrink-0 text-zinc-400"
                  strokeWidth={2}
                  aria-hidden
                />
                <input
                  id={cardInputId}
                  name="cardNumber"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder={cardPh}
                  className="min-w-0 flex-1 border-0 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
                />
                <span className="shrink-0 rounded-lg border border-zinc-200/95 bg-white px-2 py-0.5 text-[0.55rem] font-bold italic text-zinc-600 shadow-sm">
                  {p.paymentCardBrandLabel || "Visa"}
                </span>
              </div>
            ) : (
              <div
                className={`flex w-full min-h-10 items-center justify-between gap-2 px-3 text-sm text-zinc-400 ${cardFieldCls}`}
                aria-hidden
              >
                <span className="flex min-w-0 items-center gap-2">
                  <CreditCard className="size-4 shrink-0 text-zinc-400" strokeWidth={2} />
                  <span className="truncate">{cardPh}</span>
                </span>
                <span className="shrink-0 rounded-lg border border-zinc-200/95 bg-white px-2 py-0.5 text-[0.55rem] font-bold italic text-zinc-600 shadow-sm">
                  {p.paymentCardBrandLabel || "Visa"}
                </span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <CheckoutFieldRow
              design={design}
              label="Expiry"
              interactive={interactive}
              inputName="cardExpiry"
              placeholder={expPh}
              autoComplete="cc-exp"
              inputMode="numeric"
            >
              <span>{expPh}</span>
            </CheckoutFieldRow>
            <CheckoutFieldRow
              design={design}
              label="CVC"
              interactive={interactive}
              inputName="cardCvc"
              placeholder={cvcPh}
              autoComplete="cc-csc"
              inputMode="numeric"
            >
              <span>{cvcPh}</span>
            </CheckoutFieldRow>
          </div>
          <CheckoutFieldRow
            design={design}
            label="Name on card"
            interactive={interactive}
            inputName="cardName"
            placeholder={nameOnCardPh}
            autoComplete="cc-name"
          >
            <span className="min-w-0 truncate">{nameOnCardPh}</span>
          </CheckoutFieldRow>
        </div>
      </div>

      <button
        type={interactive ? "submit" : "button"}
        className="mt-2 w-full cursor-pointer rounded-lg bg-zinc-900 py-3 text-sm font-semibold text-white shadow-sm"
      >
        {submitLabel}
      </button>

      <p className="pt-1 text-center text-[0.65rem] text-zinc-500">
        {p.paymentFooterText?.trim() ? (
          p.paymentFooterText
        ) : (
          <>
            Powered by <span className="font-semibold text-zinc-700">stripe</span>
          </>
        )}
      </p>
    </div>
  );

  if (!interactive) return body;

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      {body}
    </form>
  );
}
