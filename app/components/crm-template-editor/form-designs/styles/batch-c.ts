import type { FormDesign, FormDesignStyle } from "../types";

export const formDesignStylesBatchC: Partial<Record<FormDesign, FormDesignStyle>> = {
  flat_modern_form: {
    shellClass: "rounded-none border-0 border-y border-zinc-200 bg-white py-6",
    labelClass: "mb-1 block text-[0.65rem] font-medium text-zinc-500",
    fieldClass:
      "h-10 w-full rounded-none border-0 border-b border-zinc-200 bg-zinc-50/50 px-2",
    rowClass: "min-w-0 text-left",
    fieldsContainerClass: "space-y-4",
    splitVariant: null,
    swatchKind: "underline",
  },
  sectioned_form: {
    shellClass:
      "rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm ring-1 ring-zinc-100",
    labelClass: "mb-1.5 block text-[0.65rem] font-medium text-zinc-500",
    fieldClass:
      "h-10 w-full rounded-lg border border-zinc-200/90 bg-white shadow-sm",
    rowClass: "min-w-0 text-left",
    fieldsContainerClass: "space-y-4",
    splitVariant: null,
    swatchKind: "rounded",
    extra: "wizard",
  },
  centered_form: {
    shellClass:
      "mx-auto max-w-md rounded-2xl border border-zinc-200/80 bg-white p-5 text-center shadow-sm",
    labelClass: "mb-1.5 block text-[0.65rem] font-medium text-zinc-500",
    fieldClass:
      "h-10 w-full rounded-lg border border-zinc-200/80 bg-zinc-50/80 shadow-sm",
    rowClass: "min-w-0 text-center",
    fieldsContainerClass: "space-y-4",
    splitVariant: null,
    swatchKind: "rounded",
  },
  left_aligned_form: {
    shellClass: "rounded-2xl border border-zinc-200/80 bg-white p-5 text-left shadow-sm",
    labelClass: "mb-1.5 block text-[0.65rem] font-medium text-zinc-500",
    fieldClass:
      "h-10 w-full rounded-lg border border-zinc-200/80 bg-white px-3 shadow-sm",
    rowClass: "min-w-0 text-left",
    fieldsContainerClass: "space-y-4",
    splitVariant: null,
    swatchKind: "card",
  },
  right_aligned_form: {
    shellClass: "rounded-2xl border border-zinc-200/80 bg-white p-5 text-right shadow-sm",
    labelClass: "mb-1.5 block text-[0.65rem] font-medium text-zinc-500",
    fieldClass:
      "h-10 w-full rounded-lg border border-zinc-200/80 bg-white px-3 text-left shadow-sm",
    rowClass: "min-w-0 text-right",
    fieldsContainerClass: "space-y-4",
    splitVariant: null,
    swatchKind: "card",
  },
  full_width_form: {
    shellClass:
      "w-full rounded-none border-x-0 border-y border-zinc-200 bg-zinc-50/50 py-6",
    labelClass: "mb-1.5 block text-[0.65rem] font-semibold text-zinc-600",
    fieldClass:
      "h-11 w-full max-w-none rounded-md border border-zinc-300 bg-white px-3 shadow-sm",
    rowClass: "min-w-0 text-left",
    fieldsContainerClass: "space-y-4",
    splitVariant: null,
    swatchKind: "underline",
  },
  rounded_corner_form: {
    shellClass:
      "rounded-3xl border border-zinc-200/60 bg-gradient-to-br from-white via-zinc-50/40 to-zinc-100/80 p-6 shadow-lg ring-1 ring-zinc-200/40",
    labelClass: "mb-1.5 block text-[0.65rem] font-medium text-zinc-500",
    fieldClass:
      "h-11 w-full rounded-2xl border border-zinc-200/70 bg-white/95 px-3 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-zinc-100",
    rowClass: "min-w-0 text-left",
    fieldsContainerClass: "space-y-4",
    splitVariant: null,
    swatchKind: "rounded",
  },
  square_input_form: {
    shellClass: "rounded-lg border border-zinc-300 bg-white p-5 shadow-sm",
    labelClass: "mb-1 block text-[0.65rem] font-semibold text-zinc-600",
    fieldClass:
      "h-10 w-full rounded-none border-2 border-zinc-800 bg-white px-2 shadow-none",
    rowClass: "min-w-0 text-left",
    fieldsContainerClass: "space-y-3",
    splitVariant: null,
    swatchKind: "card",
  },
  soft_pastel_form: {
    shellClass:
      "rounded-2xl border border-rose-100/80 bg-gradient-to-br from-rose-50/90 via-white to-sky-50/60 p-5 shadow-sm ring-1 ring-rose-100/50",
    labelClass: "mb-1.5 block text-[0.65rem] font-medium text-rose-900/70",
    fieldClass:
      "h-10 w-full rounded-xl border border-rose-100 bg-white/90 px-3 shadow-sm",
    rowClass: "min-w-0 text-left",
    fieldsContainerClass: "space-y-4",
    splitVariant: null,
    swatchKind: "gold",
    extra: "coupon",
  },
  high_contrast_form: {
    shellClass:
      "rounded-xl border-2 border-zinc-900 bg-white p-5 shadow-[4px_4px_0_0_rgb(24_24_27)]",
    labelClass: "mb-1 block text-xs font-black uppercase tracking-wide text-zinc-900",
    fieldClass:
      "h-10 w-full rounded-md border-2 border-zinc-900 bg-yellow-50 px-2 font-medium shadow-none",
    rowClass: "min-w-0 text-left",
    fieldsContainerClass: "space-y-3",
    splitVariant: null,
    swatchKind: "card",
  },
};
