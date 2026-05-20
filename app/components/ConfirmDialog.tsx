"use client";

import { AlertTriangle, type LucideIcon } from "lucide-react";
import { useEffect, useId, useState, type ReactNode } from "react";

export type ConfirmDialogTone = "danger" | "warning";

const toneStyles = {
  danger: {
    bar: "bg-zinc-900",
    icon: "border-zinc-200 bg-zinc-50 text-zinc-900",
    confirmEnabled:
      "bg-zinc-900 text-white shadow-sm hover:bg-black active:scale-[0.98]",
  },
  warning: {
    bar: "bg-amber-500",
    icon: "border-amber-200/80 bg-amber-50 text-amber-800",
    confirmEnabled:
      "bg-amber-600 text-white shadow-sm hover:bg-amber-700 active:scale-[0.98]",
  },
} as const;

export function ConfirmDialog({
  open,
  title,
  titleId: titleIdProp,
  description,
  icon: Icon = AlertTriangle,
  tone = "danger",
  zIndex = 60,
  panelClassName = "max-w-[26rem]",
  cancelLabel = "Cancel",
  confirmLabel = "Delete",
  loadingLabel,
  isLoading = false,
  confirmDisabled = false,
  confirmCheckbox,
  onCancel,
  onConfirm,
  autoFocusCancel = false,
}: {
  open: boolean;
  title: string;
  titleId?: string;
  description: ReactNode;
  tone?: ConfirmDialogTone;
  icon?: LucideIcon;
  zIndex?: number;
  panelClassName?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  loadingLabel?: string;
  isLoading?: boolean;
  confirmDisabled?: boolean;
  confirmCheckbox?: { label: string };
  onCancel: () => void;
  onConfirm: () => void;
  autoFocusCancel?: boolean;
}) {
  const generatedTitleId = useId();
  const titleId = titleIdProp ?? generatedTitleId;
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const styles = toneStyles[tone];

  useEffect(() => {
    if (!open) {
      setCheckboxChecked(false);
      return;
    }
    if (isLoading) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, isLoading, onCancel]);

  if (!open) return null;

  const needsCheckbox = confirmCheckbox != null;
  const confirmBlocked =
    confirmDisabled || isLoading || (needsCheckbox && !checkboxChecked);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        aria-label="Close dialog"
        disabled={isLoading}
        onClick={onCancel}
        className="absolute inset-0 cursor-default bg-zinc-900/50 backdrop-blur-[2px]"
      />

      <div
        className={`relative w-full overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-xl ring-1 ring-black/5 ${panelClassName}`}
      >
        <div className={`h-0.5 ${styles.bar}`} aria-hidden />

        <div className="px-5 pb-4 pt-5 sm:px-6">
          <div className="flex gap-4">
            <span
              className={`flex size-11 shrink-0 items-center justify-center rounded-xl border shadow-sm ${styles.icon}`}
              aria-hidden
            >
              <Icon className="size-5" strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <h2
                id={titleId}
                className="text-base font-semibold leading-snug text-zinc-900"
              >
                {title}
              </h2>
              <div className="mt-1.5 text-sm leading-relaxed text-zinc-500">
                {description}
              </div>
            </div>
          </div>

          {needsCheckbox ? (
            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-lg border border-zinc-200/90 bg-zinc-50/80 px-3 py-2.5 transition hover:bg-zinc-50">
              <span className="relative mt-0.5 flex size-4 shrink-0 items-center justify-center">
                <input
                  type="checkbox"
                  checked={checkboxChecked}
                  disabled={isLoading}
                  onChange={(e) => setCheckboxChecked(e.target.checked)}
                  className="peer size-4 cursor-pointer appearance-none rounded border-2 border-zinc-300 bg-white transition checked:border-zinc-900 checked:bg-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900/20 focus-visible:ring-offset-1 disabled:opacity-50"
                />
                <svg
                  className="pointer-events-none absolute size-2.5 text-white opacity-0 peer-checked:opacity-100"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M2.5 6L5 8.5L9.5 3.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-sm font-medium leading-snug text-zinc-700 select-none">
                {confirmCheckbox.label}
              </span>
            </label>
          ) : null}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-zinc-100 bg-zinc-50/50 px-5 py-3.5 sm:flex-row sm:justify-end sm:gap-2.5 sm:px-6">
          <button
            type="button"
            disabled={isLoading}
            onClick={onCancel}
            autoFocus={autoFocusCancel}
            className="h-10 cursor-pointer rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50 sm:min-w-[6.5rem]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={confirmBlocked}
            onClick={onConfirm}
            className={`h-10 cursor-pointer rounded-lg px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400 sm:min-w-[6.5rem] ${
              confirmBlocked ? "" : styles.confirmEnabled
            }`}
          >
            {isLoading ? (loadingLabel ?? `${confirmLabel}…`) : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
