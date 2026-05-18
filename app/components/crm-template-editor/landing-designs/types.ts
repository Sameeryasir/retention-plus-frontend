export type { LandingDesign } from "@/app/components/crm-template-editor/landing-designs/landing-design-catalog";

export type LandingDesignSwatchKind =
  | "lavender"
  | "dark"
  | "warm"
  | "green"
  | "blue"
  | "mono"
  | "rose"
  | "contrast"
  | "gold"
  | "cream"
  | "plum"
  | "coral"
  | "slate"
  | "electric"
  | "sage"
  | "wine"
  | "candy"
  | "teal"
  | "indigo"
  | "berry"
  | "mint"
  | "forest";

export type LandingDesignStyle = {
  label: string;
  description: string;
  swatchKind: LandingDesignSwatchKind;
  backgroundDefault: string;
  primary: string;
  secondary: string;
  badgeClass: string;
  badgeText: string;
  headingClass: string;
  subheadingClass: string;
  bodyClass: string;
  dividerClass: string;
  ctaShadow: string;
  trustClass: string;
  heroPlaceholderClass: string;
  eyebrow: string;
  trustLine: string;
};

export type LandingDesignOptionRow = {
  value: import("@/app/components/crm-template-editor/landing-designs/landing-design-catalog").LandingDesign;
  label: string;
  description: string;
};
