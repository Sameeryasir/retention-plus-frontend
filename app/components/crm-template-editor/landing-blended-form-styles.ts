import { LANDING_DESIGN_CATALOG } from "@/app/components/crm-template-editor/landing-designs/landing-design-catalog";
import { getFormDesignStyle } from "@/app/components/crm-template-editor/form-designs/registry";
import type { FormDesign } from "@/app/components/crm-template-editor/form-designs/types";
import type { FormDesignStyle } from "@/app/components/crm-template-editor/form-designs/types";

export function isLandingDesignDark(design: string | undefined): boolean {
  const entry = LANDING_DESIGN_CATALOG.find((row) => row.id === design);
  return entry?.mode === "dark";
}

/** Tweaks Tailwind classes so a form preset stays readable on dark landing backgrounds. */
function adaptClassForDarkLanding(className: string): string {
  return className
    .replace(/\btext-zinc-900\b/g, "text-white")
    .replace(/\btext-zinc-800\b/g, "text-white/90")
    .replace(/\btext-zinc-700\b/g, "text-white/85")
    .replace(/\btext-zinc-600\b/g, "text-white/80")
    .replace(/\btext-zinc-500\b/g, "text-white/70")
    .replace(/\btext-zinc-400\b/g, "text-white/55")
    .replace(/\bbg-white\b/g, "bg-white/10")
    .replace(/\bbg-zinc-50\b/g, "bg-white/5")
    .replace(/\bborder-zinc-300\b/g, "border-white/25")
    .replace(/\bborder-zinc-200\b/g, "border-white/20")
    .replace(/\bring-zinc-950\b/g, "ring-white/10");
}

/**
 * Keeps the user's chosen form design (underline, pill, glass, etc.) but drops
 * the outer card/split chrome so fields sit on the landing page design.
 */
export function blendFormDesignWithLanding(
  design: FormDesign,
  landingDesignId: string | undefined,
): Pick<
  FormDesignStyle,
  "shellClass" | "labelClass" | "fieldClass" | "rowClass" | "fieldsContainerClass"
> {
  const base = getFormDesignStyle(design);
  const isDark = isLandingDesignDark(landingDesignId);

  if (!isDark) {
    return {
      shellClass: "",
      labelClass: base.labelClass,
      fieldClass: base.fieldClass,
      rowClass: base.rowClass,
      fieldsContainerClass: base.fieldsContainerClass,
    };
  }

  return {
    shellClass: "",
    labelClass: adaptClassForDarkLanding(base.labelClass),
    fieldClass: adaptClassForDarkLanding(base.fieldClass),
    rowClass: adaptClassForDarkLanding(base.rowClass),
    fieldsContainerClass: base.fieldsContainerClass,
  };
}
