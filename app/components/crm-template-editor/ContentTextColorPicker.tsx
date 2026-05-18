"use client";

import { useId } from "react";
import {
  colorInputValue,
  normalizeHexColor,
} from "@/app/components/crm-template-editor/landing-content-colors";

export function ContentTextColorPicker({
  value,
  onChange,
  fallbackHex = "#18181B",
}: {
  value: string;
  onChange: (color: string) => void;
  fallbackHex?: string;
}) {
  const inputId = useId();
  const pickerValue = colorInputValue(value, fallbackHex);
  const hasCustom = Boolean(normalizeHexColor(value));

  return (
    <div
      className="mt-1.5 flex items-center gap-2 rounded-xl border border-zinc-200/95 bg-gradient-to-br from-white to-zinc-50/90 px-2.5 py-1.5 shadow-sm ring-1 ring-inset ring-white/80"
      role="group"
      aria-label="Text color"
    >
      <span className="shrink-0 rounded-md bg-zinc-900/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">
        Color
      </span>

      <span className="h-4 w-px shrink-0 bg-gradient-to-b from-transparent via-zinc-300 to-transparent" aria-hidden />

      <label
        htmlFor={`${inputId}-picker`}
        className="group relative block size-7 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 border-white shadow-[0_1px_3px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.35)] ring-1 ring-zinc-200/80 transition hover:scale-105 hover:shadow-md hover:ring-zinc-300"
        style={{ backgroundColor: pickerValue }}
        title="Pick a color"
      >
        <input
          id={`${inputId}-picker`}
          type="color"
          value={pickerValue}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 size-full cursor-pointer opacity-0"
          aria-label="Pick text color"
        />
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent"
          aria-hidden
        />
        {!hasCustom ? (
          <span
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,transparent_42%,rgba(255,255,255,0.55)_42%,rgba(255,255,255,0.55)_58%,transparent_58%)]"
            aria-hidden
          />
        ) : null}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(normalizeHexColor(e.target.value))}
        placeholder="Default"
        className={[
          "min-w-0 flex-1 border-0 bg-transparent py-0 font-mono text-[11px] outline-none",
          hasCustom
            ? "font-semibold uppercase tracking-wide text-zinc-900"
            : "italic text-zinc-400 placeholder:not-italic placeholder:font-medium placeholder:text-zinc-400",
        ].join(" ")}
        spellCheck={false}
        maxLength={7}
      />

      {hasCustom ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="shrink-0 rounded-md border border-zinc-200/90 bg-white px-2 py-0.5 text-[10px] font-semibold text-zinc-600 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900"
        >
          Reset
        </button>
      ) : null}
    </div>
  );
}
