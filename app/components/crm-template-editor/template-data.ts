import type {
  FormDesign,
  FormFieldId,
  TemplatePagesState,
} from "@/app/components/crm-template-editor/template-types";

const DEFAULT_FIELDS: FormFieldId[] = [
  "firstName",
  "lastName",
  "email",
  "phone",
];

const DEFAULT_DESIGN: FormDesign = "stacked_input_form";

const LOREM_HEADING = "Lorem ipsum dolor sit amet";

const LOREM_SUB =
  "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const LOREM_BODY = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

export const INITIAL_TEMPLATE_PAGES: TemplatePagesState = {
  landing: {
    id: "landing",
    label: "Landing Page",
    heading: LOREM_HEADING,
    subheading: LOREM_SUB,
    body: LOREM_BODY,
    buttonText: "Lorem CTA",
    imageUrl: "",
    imageScale: 1,
    backgroundColor: "#fafafa",
    layoutType: "centered",
  },
  signup: {
    id: "signup",
    label: "Sign Up Page",
    heading: LOREM_HEADING,
    subheading: LOREM_SUB,
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.",
    buttonText: "Continue",
    imageUrl: "",
    imageScale: 1,
    backgroundColor: "#ffffff",
    layoutType: "stacked",
    formFieldIds: [...DEFAULT_FIELDS],
    formDesign: DEFAULT_DESIGN,
    navBackLabel: "Back",
    navNextLabel: "Next",
  },
  payment: {
    id: "payment",
    label: "Payment Page",
    heading: "Payment details",
    subheading:
      "Use a saved card or enter a new one to finish checkout.",
    body: LOREM_BODY,
    buttonText: "Submit payment",
    imageUrl: "",
    imageScale: 1,
    backgroundColor: "#f4f4f5",
    layoutType: "narrow",
    formDesign: DEFAULT_DESIGN,
    payWithLinkText: "Pay with link",
    checkoutDividerText: "or",
    contactSectionTitle: "Contact details",
    paymentEmailPlaceholder: "email@example.com",
    paymentFullNamePlaceholder: "Full name",
    paymentPhonePlaceholder: "0301 2345678",
    paymentMethodSectionTitle: "Payment method",
    paymentCardPlaceholder: "1234 1234 1234 1234",
    paymentExpiryPlaceholder: "MM / YY",
    paymentCvcPlaceholder: "CVC",
    paymentNameOnCardPlaceholder: "Full name on card",
    paymentCardBrandLabel: "Visa",
    paymentChooseCurrencyLabel: "Choose a currency:",
    paymentCurrencyRateHint: "1 USD (289.7733 PKR)",
    paymentFooterText: "Powered by stripe",
  },
  confirmation: {
    id: "confirmation",
    label: "Confirmation Page",
    heading: LOREM_HEADING,
    subheading: LOREM_SUB,
    body: LOREM_BODY,
    buttonText: "View details",
    imageUrl: "",
    imageScale: 1,
    backgroundColor: "#fafafa",
    layoutType: "centered",
  },
};

export const LAYOUT_OPTIONS: { value: string; label: string }[] = [
  { value: "centered", label: "Centered" },
  { value: "stacked", label: "Stacked" },
  { value: "narrow", label: "Narrow column" },
  { value: "wide", label: "Wide hero" },
  { value: "split", label: "Split layout" },
];

export type { FormDesignOptionRow as FormDesignOption } from "@/app/components/crm-template-editor/form-designs/types";
export { FORM_DESIGN_OPTIONS } from "@/app/components/crm-template-editor/form-designs/form-design-options";

export const FORM_FIELD_OPTIONS: { id: FormFieldId; label: string }[] = [
  { id: "firstName", label: "First name" },
  { id: "lastName", label: "Last name" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
];
