import type { FormDesign, FormDesignStyle } from "../types";

export const formDesignStylesBatchB: Partial<Record<FormDesign, FormDesignStyle>> = {
  minimal_border_form: {
    shellClass:
      "rounded-2xl border border-zinc-300/80 bg-white p-5 shadow-lg shadow-zinc-900/10 ring-1 ring-zinc-950/[0.06]",
    labelClass: "mb-1.5 block text-[0.65rem] font-medium text-zinc-500",
    fieldClass:
      "h-10 w-full rounded-lg border border-zinc-300/90 bg-white shadow-sm",
    rowClass: "min-w-0 text-left",
    fieldsContainerClass: "space-y-4",
    splitVariant: null,
    swatchKind: "card",
  },
  thin_line_form: {
    shellClass: "rounded-xl border border-zinc-200/60 bg-white p-5",
    labelClass: "mb-1 block text-[0.6rem] font-medium text-zinc-400",
    fieldClass:
      "h-9 w-full rounded-none border-0 border-b border-zinc-200 bg-transparent px-0.5",
    rowClass: "min-w-0 text-left",
    fieldsContainerClass: "space-y-3",
    splitVariant: null,
    swatchKind: "underline",
  },
  bold_label_form: {
    shellClass: "rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm",
    labelClass: "mb-1 block text-xs font-bold text-zinc-900",
    fieldClass:
      "h-10 w-full rounded-lg border-2 border-zinc-900/10 bg-white px-3 shadow-sm",
    rowClass: "min-w-0 text-left",
    fieldsContainerClass: "space-y-4",
    splitVariant: null,
    swatchKind: "card",
  },
  compact_dense_form: {
    shellClass:
      "rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-4 shadow-inner",
    labelClass: "mb-0.5 block text-[0.6rem] font-semibold text-zinc-500",
    fieldClass:
      "h-9 w-full rounded-md border border-zinc-200 bg-white px-2 text-sm shadow-sm",
    rowClass: "min-w-0 text-left",
    fieldsContainerClass: "space-y-2",
    splitVariant: null,
    swatchKind: "rounded",
  },
  spacious_airy_form: {
    shellClass:
      "rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm ring-1 ring-zinc-100",
    labelClass: "mb-2 block text-sm font-medium text-zinc-500",
    fieldClass:
      "h-12 w-full rounded-xl border border-zinc-200/70 bg-zinc-50/40 px-4 shadow-sm",
    rowClass: "min-w-0 text-left",
    fieldsContainerClass: "space-y-6",
    splitVariant: null,
    swatchKind: "rounded",
  },
  dark_mode_form: {
    shellClass:
      "rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 p-5 text-white shadow-xl shadow-zinc-900/30 ring-1 ring-white/5",
    labelClass:
      "mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-wide text-zinc-400",
    fieldClass:
      "h-10 w-full rounded-lg border border-zinc-600/70 bg-zinc-800/90 shadow-[inset_0_1px_3px_rgba(0,0,0,0.35)]",
    rowClass: "min-w-0 text-left",
    fieldsContainerClass: "space-y-4",
    splitVariant: null,
    swatchKind: "dark",
  },
  light_panel_form: {
    shellClass:
      "rounded-2xl border border-zinc-200/80 bg-gradient-to-b from-white to-zinc-50/80 p-5 shadow-sm ring-1 ring-zinc-100",
    labelClass: "mb-1.5 block text-[0.65rem] font-medium text-zinc-500",
    fieldClass:
      "h-10 w-full rounded-lg border border-zinc-200/90 bg-white shadow-sm",
    rowClass: "min-w-0 text-left",
    fieldsContainerClass: "space-y-4",
    splitVariant: null,
    swatchKind: "card",
  },
  gradient_background_form: {
    shellClass: "",
    labelClass: "mb-1.5 block text-[0.65rem] font-semibold text-zinc-700",
    fieldClass:
      "h-10 w-full rounded-lg border border-white/60 bg-white/90 px-3 shadow-sm backdrop-blur-sm",
    rowClass: "min-w-0 text-left",
    fieldsContainerClass: "space-y-4",
    splitVariant: "gradient",
    swatchKind: "split",
  },
  transparent_form: {
    shellClass: "rounded-2xl border border-dashed border-zinc-300/80 bg-transparent p-5",
    labelClass: "mb-1.5 block text-[0.65rem] font-medium text-zinc-500",
    fieldClass:
      "h-10 w-full rounded-lg border border-zinc-200/60 bg-white/70 px-3 backdrop-blur-[2px]",
    rowClass: "min-w-0 text-left",
    fieldsContainerClass: "space-y-4",
    splitVariant: null,
    swatchKind: "glass",
  },
  elevated_card_form: {
    shellClass:
      "rounded-2xl border border-zinc-200/60 bg-white p-6 shadow-xl shadow-zinc-900/15 ring-1 ring-zinc-200/40",
    labelClass: "mb-1.5 block text-[0.65rem] font-medium text-zinc-600",
    fieldClass:
      "h-10 w-full rounded-lg border border-zinc-200/80 bg-white px-3 shadow-md",
    rowClass: "min-w-0 text-left",
    fieldsContainerClass: "space-y-4",
    splitVariant: null,
    swatchKind: "rounded",
  },
};
