"use client";

import { useId } from "react";
import {
  colorInputValue,
  normalizeHexColor,
} from "@/app/components/crm-template-editor/landing-content-colors";
import {
  editorColorPickerBadgeClass,
  editorColorPickerDividerClass,
  editorColorPickerHexInputClass,
  editorColorPickerResetClass,
  editorColorPickerShellClass,
  editorColorPickerSwatchClass,
} from "@/app/components/crm-template-editor/editor-sidebar-theme";

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
      className={editorColorPickerShellClass}
      role="group"
      aria-label="Text color"
    >
      <span className={editorColorPickerBadgeClass}>Color</span>

      <span className={editorColorPickerDividerClass} aria-hidden />

      <label
        htmlFor={`${inputId}-picker`}
        className={editorColorPickerSwatchClass}
        style={{ backgroundColor: pickerValue }}
        title="Pick a color"
      >
        <input
          id={`${inputId}-picker`}
          type="color"
          value={pickerValue}
          onChange={(e) => onChange(normalizeHexColor(e.target.value))}
          className="absolute inset-0 size-full cursor-pointer opacity-0"
          aria-label="Pick text color"
        />
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent"
          aria-hidden
        />
        {!hasCustom ? (
          <span
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,transparent_42%,rgba(255,255,255,0.35)_42%,rgba(255,255,255,0.35)_58%,transparent_58%)]"
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
          editorColorPickerHexInputClass,
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
          className={editorColorPickerResetClass}
        >
          Reset
        </button>
      ) : null}
    </div>
  );
}
