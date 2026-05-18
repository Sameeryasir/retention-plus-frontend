import {
  HERO_LAYOUT_PRESETS,
  type HeroLayoutPresetKey,
} from "@/app/components/crm-template-editor/hero-designs/hero-layout-presets";
import type { HeroDesignStyle } from "@/app/components/crm-template-editor/hero-designs/types";

export type HeroDesignCatalogEntry = {
  id: string;
  label: string;
  description: string;
  preset: HeroLayoutPresetKey;
  overrides?: Partial<
    Pick<
      HeroDesignStyle,
      | "wrapperClass"
      | "frameClass"
      | "imageClass"
      | "fade"
      | "placeholderClass"
      | "previewKind"
    >
  >;
};

/** Merges a catalog row with a shared layout preset into a full hero style. */
export function buildHeroDesignStyle(
  entry: HeroDesignCatalogEntry,
): HeroDesignStyle {
  const base = HERO_LAYOUT_PRESETS[entry.preset];
  return {
    label: entry.label,
    description: entry.description,
    ...base,
    ...entry.overrides,
  };
}
