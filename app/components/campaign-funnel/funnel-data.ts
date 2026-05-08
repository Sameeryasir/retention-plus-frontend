/**
 * Sign-up step: field order and grouping on the phone + editor preview.
 * - stacked: first, last, phone (full width each)
 * - name_row: first | last in one row, phone full width
 * - phone_first: phone first, then first, then last (SMS-first style)
 * - name_row_reverse: last | first in one row, then phone
 */
export type SignupFormLayout =
  | "stacked"
  | "name_row"
  | "phone_first"
  | "name_row_reverse";

export function normalizeSignupFormLayout(
  value: SignupFormLayout | null | undefined,
): SignupFormLayout {
  if (
    value === "name_row" ||
    value === "phone_first" ||
    value === "name_row_reverse"
  ) {
    return value;
  }
  return "stacked";
}

/**
 * Payment checkout mock: section order on the phone + editor.
 * - standard: deal → pay link → contact → card (default Stripe-like flow)
 * - contact_first: contact block before the pay-with-link step
 * - card_first: card block before contact details
 * - contact_inline: email + full name side by side, phone full width
 */
export type PaymentCheckoutLayout =
  | "standard"
  | "contact_first"
  | "card_first"
  | "contact_inline";

export function normalizePaymentCheckoutLayout(
  value: PaymentCheckoutLayout | null | undefined,
): PaymentCheckoutLayout {
  if (
    value === "contact_first" ||
    value === "card_first" ||
    value === "contact_inline"
  ) {
    return value;
  }
  return "standard";
}

export type PaymentCheckoutSectionKey =
  | "intro"
  | "deal"
  | "currency"
  | "payLink"
  | "or"
  | "contactTitle"
  | "contactFields"
  | "methodTitle"
  | "cardBlock"
  | "billingExtra";

export const PAYMENT_CHECKOUT_SECTION_ORDER: Record<
  PaymentCheckoutLayout,
  PaymentCheckoutSectionKey[]
> = {
  standard: [
    "intro",
    "deal",
    "currency",
    "payLink",
    "or",
    "contactTitle",
    "contactFields",
    "methodTitle",
    "cardBlock",
    "billingExtra",
  ],
  contact_first: [
    "intro",
    "deal",
    "currency",
    "contactTitle",
    "contactFields",
    "payLink",
    "or",
    "methodTitle",
    "cardBlock",
    "billingExtra",
  ],
  card_first: [
    "intro",
    "deal",
    "currency",
    "payLink",
    "or",
    "methodTitle",
    "cardBlock",
    "contactTitle",
    "contactFields",
    "billingExtra",
  ],
  contact_inline: [
    "intro",
    "deal",
    "currency",
    "payLink",
    "or",
    "contactTitle",
    "contactFields",
    "methodTitle",
    "cardBlock",
    "billingExtra",
  ],
};

export type FunnelPage = {
  id: string;
  label: string;
  pageTitle: string;
  headline: string;
  subheadline: string;
  body: string;
  ctaLabel: string;
  heroImageSrc?: string | null;
  /** Zoom inside the hero frame (see funnel-limits `normalizeHeroImageScale`). */
  heroImageScale?: number | null;
  signupFirstNameLabel: string;
  signupLastNameLabel: string;
  signupPhoneLabel: string;
  /** Sign-up editor: field order / grouping (see SignupFormLayout). */
  signupFormLayout?: SignupFormLayout | null;
  paymentMockContactTitle?: string;
  paymentMockMethodTitle?: string;
  paymentMockEmail?: string;
  paymentMockFullName?: string;
  paymentMockPhone?: string;
  paymentMockCardNumber?: string;
  paymentMockCardBrand?: string;
  paymentMockExpiry?: string;
  paymentMockCvc?: string;
  paymentMockNameOnCard?: string;
  paymentMockCountry?: string;
  paymentMockSaveLabel?: string;
  /** Payment editor: checkout section order / contact grouping. */
  paymentCheckoutLayout?: PaymentCheckoutLayout | null;
};

export const INITIAL_PAGES: FunnelPage[] = [
  {
    id: "landing",
    label: "Landing Page",
    pageTitle: "Union",
    headline: "Union Pub & Social",
    subheadline: "Special Daily Deal…",
    body: "BADGER BITES — JUST $4\n\nNormally $12 — You save $8 instantly (67% off).\n\nThat is $8 staying in your pocket — for real food, full sized, not a sample plate.\n\nGolden fried cheese curds — hot and oozing — piled high with sweet, smoky bacon jam that melts into every crispy edge, finished with cool ranch for the perfect dunk.\n\nShow up hungry. Walk out smiling. This deal is for today only while supplies last.\n\nCrunch. Melt. Sweet. Savory. Repeat.",
    ctaLabel: "Claim",
    signupFirstNameLabel: "",
    signupLastNameLabel: "",
    signupPhoneLabel: "",
  },
  {
    id: "signup",
    label: "Sign Up",
    pageTitle: "Sign up",
    headline: "Create your account",
    subheadline: "",
    body: "Enter your details so we can send your reward and reminders.",
    ctaLabel: "Continue",
    signupFirstNameLabel: "First name *",
    signupLastNameLabel: "Last name *",
    signupPhoneLabel: "Phone *",
    signupFormLayout: "stacked",
  },
  {
    id: "payment",
    label: "Payment",
    pageTitle: "Payment",
    headline: "Payment details",
    subheadline: "",
    body: "Use a saved card or enter a new one to finish checkout.",
    ctaLabel: "Submit payment",
    signupFirstNameLabel: "",
    signupLastNameLabel: "",
    signupPhoneLabel: "",
    paymentMockContactTitle: "Contact details",
    paymentMockMethodTitle: "Payment method",
    paymentMockEmail: "email@example.com",
    paymentMockFullName: "Full name",
    paymentMockPhone: "0301 2345678",
    paymentMockCardNumber: "1234 1234 1234 1234",
    paymentMockCardBrand: "Visa",
    paymentMockExpiry: "MM / YY",
    paymentMockCvc: "CVC",
    paymentMockNameOnCard: "Full name on card",
    paymentMockCountry: "Pakistan ▾",
    paymentMockSaveLabel: "Save my information for faster checkout",
    paymentCheckoutLayout: "standard",
  },
  {
    id: "confirmation",
    label: "Payment Confirmation",
    pageTitle: "Confirmation",
    headline: "You're all set",
    subheadline: "",
    body: "We sent a confirmation to your phone. Show your pass at the restaurant.",
    ctaLabel: "View pass",
    signupFirstNameLabel: "",
    signupLastNameLabel: "",
    signupPhoneLabel: "",
  },
];

export function pageNeedsAttention(p: FunnelPage): boolean {
  if (p.id === "signup") {
    return (
      !p.signupFirstNameLabel.trim() ||
      !p.signupLastNameLabel.trim() ||
      !p.signupPhoneLabel.trim()
    );
  }
  if (
    !p.pageTitle.trim() ||
    !p.headline.trim() ||
    !p.body.trim() ||
    !p.ctaLabel.trim()
  ) {
    return true;
  }
  if (p.id === "landing" && !p.subheadline.trim()) return true;
  return false;
}
