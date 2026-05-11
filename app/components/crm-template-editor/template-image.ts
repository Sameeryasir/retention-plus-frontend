import type { CSSProperties } from "react";

export const IMAGE_SCALE_MIN = 0.75;
export const IMAGE_SCALE_MAX = 1.5;

export function normalizeImageScale(
  value: number | null | undefined,
): number {
  if (typeof value !== "number" || Number.isNaN(value)) return 1;
  return Math.min(
    IMAGE_SCALE_MAX,
    Math.max(IMAGE_SCALE_MIN, value),
  );
}

export function imageScaleStyle(
  scale: number | null | undefined,
): CSSProperties {
  const s = normalizeImageScale(scale);
  return {
    transform: `scale(${s})`,
    transformOrigin: "center center",
  };
}
