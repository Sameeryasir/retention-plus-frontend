import { getFormDesignStyle } from "@/app/components/crm-template-editor/form-designs/registry";
import type { FormDesign } from "@/app/components/crm-template-editor/form-designs/types";
import {
  blendFormDesignWithLanding,
  isLandingDesignDark,
} from "@/app/components/crm-template-editor/landing-blended-form-styles";

export type CheckoutFormStyles = {
  labelClass: string;
  fieldClass: string;
  rowClass: string;
  fieldsContainerClass: string;
  shellClass: string;
  isDark: boolean;
};

export function getCheckoutFormStyles(
  formDesign: FormDesign,
  options?: {
    landingDesignId?: string | null;
    blendWithLanding?: boolean;
  },
): CheckoutFormStyles {
  const blend = Boolean(options?.blendWithLanding && options.landingDesignId);
  const style = blend
    ? blendFormDesignWithLanding(formDesign, options!.landingDesignId!)
    : getFormDesignStyle(formDesign);

  const isDark = blend
    ? isLandingDesignDark(options!.landingDesignId!)
    : formDesign === "dark_mode_form";

  const fieldBase = `${style.fieldClass} w-full text-left outline-none px-3 text-sm`;
  const fieldClass = isDark
    ? `${fieldBase} text-white placeholder:text-white/45 focus-visible:ring-2 focus-visible:ring-white/20`
    : `${fieldBase} text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-zinc-900/10`;

  return {
    labelClass: `${style.labelClass} w-full text-left`,
    fieldClass,
    rowClass: style.rowClass,
    fieldsContainerClass: style.fieldsContainerClass,
    shellClass: blend ? style.shellClass : style.shellClass,
    isDark,
  };
}

export function checkoutPreviewFieldShell(formStyles: CheckoutFormStyles): string {
  return [
    formStyles.fieldClass,
    "flex min-h-11 items-center gap-2",
    formStyles.isDark ? "text-zinc-400" : "text-zinc-500",
  ].join(" ");
}

export function checkoutStripeFieldShell(formStyles: CheckoutFormStyles): string {
  return [
    checkoutPreviewFieldShell(formStyles),
    "py-2.5 [&_.StripeElement]:w-full [&_.StripeElement]:min-w-0",
  ].join(" ");
}
