export type TemplatePageId =
  | "landing"
  | "signup"
  | "payment"
  | "confirmation";

export type FormFieldId = "firstName" | "lastName" | "email" | "phone";

import type { FormDesign } from "@/app/components/crm-template-editor/form-designs/types";
import type { HeroDesign } from "@/app/components/crm-template-editor/hero-designs/types";
import type { LandingDesign } from "@/app/components/crm-template-editor/landing-designs/types";
export type { FormDesign, HeroDesign, LandingDesign };

export interface TemplatePageBase {
  id: TemplatePageId;
  label: string;
  heading: string;
  subheading: string;
  body: string;
  buttonText: string;
  imageUrl: string;
  imageScale: number;
  backgroundColor: string;
  layoutType: string;
}

export interface SignUpTemplatePage extends TemplatePageBase {
  id: "signup";
  formFieldIds: FormFieldId[];
  formDesign: FormDesign;
  navBackLabel: string;
  navNextLabel: string;
}

export interface PaymentTemplatePage extends TemplatePageBase {
  id: "payment";
  formDesign: FormDesign;
  payWithLinkText: string;
  checkoutDividerText: string;
  contactSectionTitle: string;
  paymentEmailPlaceholder: string;
  paymentFullNamePlaceholder: string;
  paymentPhonePlaceholder: string;
  paymentMethodSectionTitle: string;
  paymentCardPlaceholder: string;
  paymentExpiryPlaceholder: string;
  paymentCvcPlaceholder: string;
  paymentNameOnCardPlaceholder: string;
  paymentCardBrandLabel: string;
  paymentChooseCurrencyLabel: string;
  paymentCurrencyRateHint: string;
  paymentFooterText: string;
}

export type LandingTemplatePage = TemplatePageBase & {
  id: "landing";
  landingDesign: LandingDesign;
  heroDesign: HeroDesign;
  /** Empty string = use colors from the selected page design preset. */
  headingColor: string;
  subheadingColor: string;
  bodyColor: string;
  buttonTextColor: string;
};

export type TemplatePage =
  | LandingTemplatePage
  | (TemplatePageBase & { id: "confirmation" })
  | SignUpTemplatePage
  | PaymentTemplatePage;

export type TemplatePagesState = Record<TemplatePageId, TemplatePage>;

export type TemplatePagePatch = Partial<Omit<TemplatePageBase, "id">> &
  Partial<
    Pick<
      LandingTemplatePage,
      | "landingDesign"
      | "heroDesign"
      | "headingColor"
      | "subheadingColor"
      | "bodyColor"
      | "buttonTextColor"
    >
  > &
  Partial<
    Pick<
      SignUpTemplatePage,
      "formFieldIds" | "formDesign" | "navBackLabel" | "navNextLabel"
    >
  > &
  Partial<
    Pick<
      PaymentTemplatePage,
      | "formDesign"
      | "payWithLinkText"
      | "checkoutDividerText"
      | "contactSectionTitle"
      | "paymentEmailPlaceholder"
      | "paymentFullNamePlaceholder"
      | "paymentPhonePlaceholder"
      | "paymentMethodSectionTitle"
      | "paymentCardPlaceholder"
      | "paymentExpiryPlaceholder"
      | "paymentCvcPlaceholder"
      | "paymentNameOnCardPlaceholder"
      | "paymentCardBrandLabel"
      | "paymentChooseCurrencyLabel"
      | "paymentCurrencyRateHint"
      | "paymentFooterText"
    >
  >;
