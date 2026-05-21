import type { LandingTemplatePage } from "@/app/components/crm-template-editor/template-types";

export type LandingContentSectionId =
  | "eyebrow"
  | "heading"
  | "subheading"
  | "divider"
  | "body"
  | "cta"
  | "trust";

export const DEFAULT_LANDING_SECTION_ORDER: LandingContentSectionId[] = [
  "eyebrow",
  "heading",
  "subheading",
  "divider",
  "body",
  "cta",
  "trust",
];

export const LANDING_SECTION_LABELS: Record<LandingContentSectionId, string> = {
  eyebrow: "Eyebrow badge",
  heading: "Main headline",
  subheading: "Subheadline",
  divider: "Divider line",
  body: "Body copy",
  cta: "Call to action",
  trust: "Trust line",
};

const VALID_IDS = new Set<string>(DEFAULT_LANDING_SECTION_ORDER);

export function normalizeLandingSectionOrder(
  order: LandingContentSectionId[] | undefined,
): LandingContentSectionId[] {
  if (!order?.length) return [...DEFAULT_LANDING_SECTION_ORDER];
  const seen = new Set<LandingContentSectionId>();
  const normalized: LandingContentSectionId[] = [];
  for (const id of order) {
    if (!VALID_IDS.has(id) || seen.has(id)) continue;
    seen.add(id);
    normalized.push(id);
  }
  for (const id of DEFAULT_LANDING_SECTION_ORDER) {
    if (!seen.has(id)) normalized.push(id);
  }
  return normalized;
}

export function landingSectionOrder(
  page: LandingTemplatePage,
): LandingContentSectionId[] {
  return normalizeLandingSectionOrder(page.contentSectionOrder);
}
