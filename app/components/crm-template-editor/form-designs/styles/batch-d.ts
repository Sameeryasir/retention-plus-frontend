import type { FormDesign, FormDesignStyle } from "../types";

export const formDesignStylesBatchD: Partial<Record<FormDesign, FormDesignStyle>> = {
  mobile_app_form: {
    shellClass:
      "rounded-3xl border border-zinc-200/80 bg-zinc-100/80 p-6 shadow-inner ring-1 ring-zinc-200/50",
    labelClass: "mb-1.5 block text-[0.65rem] font-medium text-zinc-500",
    fieldClass:
      "h-12 w-full rounded-2xl border border-zinc-200/70 bg-white/95 px-3 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-zinc-100",
    rowClass: "min-w-0 text-left",
    fieldsContainerClass: "space-y-4",
    splitVariant: null,
    swatchKind: "rounded",
  },
  desktop_business_form: {
    shellClass:
      "rounded-lg border border-slate-200 bg-slate-50/50 p-6 shadow-sm ring-1 ring-slate-200/60",
    labelClass: "mb-1.5 block text-xs font-semibold text-slate-600",
    fieldClass:
      "h-10 w-full rounded border border-slate-300 bg-white px-3 shadow-sm",
    rowClass: "min-w-0 text-left",
    fieldsContainerClass: "space-y-4",
    splitVariant: null,
    swatchKind: "card",
  },
  inline_label_form: {
    shellClass: "rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm",
    labelClass:
      "mr-2 inline-block w-24 shrink-0 text-right text-[0.65rem] font-medium text-zinc-500",
    fieldClass:
      "h-10 min-w-0 flex-1 rounded-md border border-zinc-200 bg-white px-2 shadow-sm",
    rowClass: "flex min-w-0 flex-row items-center gap-2 text-left",
    fieldsContainerClass: "flex flex-col gap-3",
    splitVariant: null,
    swatchKind: "card",
  },
  top_label_form: {
    shellClass: "rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm",
    labelClass: "mb-1 block text-[0.6rem] font-bold uppercase text-zinc-400",
    fieldClass:
      "h-10 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 shadow-inner",
    rowClass: "min-w-0 text-left",
    fieldsContainerClass: "space-y-4",
    splitVariant: null,
    swatchKind: "card",
  },
  animated_focus_form: {
    shellClass:
      "rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm ring-1 ring-violet-100",
    labelClass: "mb-1.5 block text-[0.65rem] font-medium text-zinc-500",
    fieldClass:
      "h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 shadow-sm transition-shadow duration-200 focus-within:ring-2 focus-within:ring-violet-400/40",
    rowClass: "min-w-0 text-left",
    fieldsContainerClass: "space-y-4",
    splitVariant: null,
    swatchKind: "rounded",
  },
  glow_border_form: {
    shellClass:
      "rounded-2xl border border-cyan-500/40 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 p-5 text-white shadow-[0_0_40px_-8px_rgba(34,211,238,0.45)] ring-1 ring-cyan-400/30",
    labelClass:
      "mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-wide text-zinc-400",
    fieldClass:
      "h-10 w-full rounded-lg border border-zinc-600/70 bg-zinc-800/90 shadow-[0_0_0_1px_rgba(34,211,238,0.35),inset_0_1px_3px_rgba(0,0,0,0.35)]",
    rowClass: "min-w-0 text-left",
    fieldsContainerClass: "space-y-4",
    splitVariant: null,
    swatchKind: "neon",
  },
  clean_saas_form: {
    shellClass:
      "rounded-xl border border-zinc-200/70 bg-white p-5 shadow-sm ring-1 ring-zinc-950/[0.03]",
    labelClass: "mb-1 block text-[0.65rem] font-medium text-zinc-400",
    fieldClass:
      "h-9 w-full rounded-md border border-zinc-200 bg-white px-2.5 text-sm shadow-sm",
    rowClass: "min-w-0 text-left",
    fieldsContainerClass: "space-y-3",
    splitVariant: null,
    swatchKind: "rounded",
    extra: "social",
  },
  elegant_luxury_form: {
    shellClass: "",
    labelClass: "mb-1.5 block text-[0.65rem] font-medium text-amber-900/80",
    fieldClass:
      "h-10 w-full rounded-lg border border-amber-200/80 bg-gradient-to-b from-amber-50/80 to-white px-3 shadow-sm",
    rowClass: "min-w-0 text-left",
    fieldsContainerClass: "space-y-4",
    splitVariant: "warm",
    swatchKind: "split",
  },
  modern_shopify_form: {
    shellClass: "",
    labelClass: "mb-1.5 block text-[0.65rem] font-medium text-zinc-700",
    fieldClass:
      "h-10 w-full rounded-md border border-zinc-300 bg-white px-3 shadow-sm",
    rowClass: "min-w-0 text-left",
    fieldsContainerClass: "space-y-4",
    splitVariant: "shop",
    swatchKind: "split",
  },
  professional_corporate_form: {
    shellClass:
      "rounded-md border border-slate-300 bg-white p-6 shadow-sm ring-1 ring-slate-200/80",
    labelClass: "mb-1 block text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500",
    fieldClass:
      "h-9 w-full rounded-sm border border-slate-300 bg-slate-50 px-2.5 shadow-inner",
    rowClass: "min-w-0 text-left",
    fieldsContainerClass: "space-y-3",
    splitVariant: null,
    swatchKind: "card",
  },
};
