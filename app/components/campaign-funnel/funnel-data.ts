export type FunnelPage = {
  id: string;
  label: string;
  pageTitle: string;
  headline: string;
  subheadline: string;
  body: string;
  ctaLabel: string;
  heroImageSrc?: string | null;
  signupFirstNameLabel: string;
  signupLastNameLabel: string;
  signupPhoneLabel: string;
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
