/** Hero crop zoom in the phone frame (1 = default). */
export const HERO_IMAGE_SCALE_MIN = 0.65;
export const HERO_IMAGE_SCALE_MAX = 1.55;
export const HERO_IMAGE_SCALE_DEFAULT = 1;

export function normalizeHeroImageScale(
  value: number | null | undefined,
): number {
  if (value == null || Number.isNaN(value)) return HERO_IMAGE_SCALE_DEFAULT;
  return Math.min(
    HERO_IMAGE_SCALE_MAX,
    Math.max(HERO_IMAGE_SCALE_MIN, value),
  );
}

/** Inline style for <img> inside an overflow-hidden frame. */
export function heroImageTransformStyle(scale?: number | null): {
  transform: string;
  transformOrigin: string;
} {
  const s = normalizeHeroImageScale(scale);
  return {
    transform: `scale(${s})`,
    transformOrigin: "center center",
  };
}

export const LANDING_PAGE_TITLE_MAX = 60;
export const LANDING_HEADLINE_MAX = 160;
export const LANDING_SUBHEADLINE_MAX = 160;
export const LANDING_BODY_MAX = 8000;
export const LANDING_CTA_MAX = 40;
export const SIGNUP_LABEL_MAX = 48;
export const PAYMENT_MOCK_FIELD_MAX = 80;
export const PAYMENT_MOCK_CARD_NUMBER_MAX = 22;
