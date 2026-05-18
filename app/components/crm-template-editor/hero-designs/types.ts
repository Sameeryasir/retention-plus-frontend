export type { HeroDesign } from "@/app/components/crm-template-editor/hero-designs/hero-design-catalog";

export type HeroPreviewKind =
  | "edge"
  | "inset"
  | "wide"
  | "tall"
  | "card"
  | "frame"
  | "arch"
  | "immersive"
  | "square"
  | "band"
  | "glass"
  | "margin";

export type HeroDesignStyle = {
  label: string;
  description: string;
  previewKind: HeroPreviewKind;
  wrapperClass: string;
  frameClass: string;
  imageClass: string;
  fade: "full" | "soft" | "none";
  placeholderClass: string;
};

export type HeroDesignOptionRow = {
  value: import("@/app/components/crm-template-editor/hero-designs/hero-design-catalog").HeroDesign;
  label: string;
  description: string;
};
