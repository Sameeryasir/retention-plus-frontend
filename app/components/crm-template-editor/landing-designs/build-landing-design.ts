import {
  DARK_THEME_PRESETS,
  LIGHT_THEME_PRESETS,
  MONO_LIGHT_PRESET,
  type DarkAccent,
  type LightAccent,
  type LandingThemePreset,
} from "@/app/components/crm-template-editor/landing-designs/landing-theme-presets";
import type { LandingDesignStyle } from "@/app/components/crm-template-editor/landing-designs/types";

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const raw = hex.replace("#", "");
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function ctaShadow(primary: string, opacity = 0.28): string {
  const { r, g, b } = hexToRgb(primary);
  return `shadow-[0_12px_28px_rgba(${r},${g},${b},${opacity})]`;
}

type SharedMeta = {
  label: string;
  description: string;
  eyebrow: string;
  trustLine: string;
};

type ColorFields = {
  backgroundDefault: string;
  primary: string;
  secondary: string;
  ctaShadowOpacity?: number;
  preset?: LandingThemePreset;
};

type LightDesignInput = SharedMeta &
  ColorFields & {
    mode: "light";
    accent: LightAccent;
  };

type DarkDesignInput = SharedMeta &
  ColorFields & {
    mode: "dark";
    accent: DarkAccent;
  };

type MonoDesignInput = SharedMeta &
  ColorFields & {
    mode: "mono";
  };

export type LandingDesignCatalogEntry = {
  id: string;
  swatchKind: LandingDesignStyle["swatchKind"];
} & (LightDesignInput | DarkDesignInput | MonoDesignInput);

function resolvePreset(
  entry: LandingDesignCatalogEntry,
): LandingThemePreset {
  if (entry.mode === "mono") return MONO_LIGHT_PRESET;
  if (entry.mode === "light") {
    return entry.preset ?? LIGHT_THEME_PRESETS[entry.accent];
  }
  return entry.preset ?? DARK_THEME_PRESETS[entry.accent];
}

/** Builds a full preview style from a small catalog row + shared theme preset. */
export function buildLandingDesignStyle(
  entry: LandingDesignCatalogEntry,
): LandingDesignStyle {
  const preset = resolvePreset(entry);
  const opacity = entry.ctaShadowOpacity;

  return {
    label: entry.label,
    description: entry.description,
    swatchKind: entry.swatchKind,
    backgroundDefault: entry.backgroundDefault,
    primary: entry.primary,
    secondary: entry.secondary,
    badgeClass: preset.badgeClass,
    badgeText: entry.eyebrow,
    headingClass: preset.headingClass,
    subheadingClass: preset.subheadingClass,
    bodyClass: preset.bodyClass,
    dividerClass: preset.dividerClass,
    ctaShadow: ctaShadow(entry.primary, opacity ?? (entry.mode === "dark" ? 0.25 : 0.28)),
    trustClass: preset.trustClass,
    heroPlaceholderClass: preset.heroPlaceholderClass,
    eyebrow: entry.eyebrow,
    trustLine: entry.trustLine,
  };
}
