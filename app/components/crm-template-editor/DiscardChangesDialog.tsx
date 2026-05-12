"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export type DiscardChangesDialogProps = {
  open: boolean;
  pageLabel?: string;
  onCancel: () => void;
  onDiscard: () => void;
};

export function DiscardChangesDialog({
  open,
  pageLabel,
  onCancel,
  onDiscard,
}: DiscardChangesDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="discard-changes-title"
    >
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onCancel}
        className="absolute inset-0 cursor-default bg-black/40 backdrop-blur-[1px]"
      />

      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl ring-1 ring-black/5">
        <div className="flex items-start gap-3 px-5 pt-5">
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700"
            aria-hidden
          >
            <AlertTriangle className="size-4 shrink-0" strokeWidth={2.25} />
          </span>
          <div className="min-w-0 flex-1">
            <h2
              id="discard-changes-title"
              className="text-sm font-semibold text-zinc-900"
            >
              Discard unsaved changes?
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-zinc-600">
              {pageLabel
                ? `Your edits to ${pageLabel} won't be saved.`
                : "Your edits won't be saved."}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2 border-t border-zinc-100 bg-zinc-50/80 px-5 py-3">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-100"
            autoFocus
          >
            Keep editing
          </button>
          <button
            type="button"
            onClick={onDiscard}
            className="cursor-pointer rounded-lg border border-red-600 bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700"
          >
            Discard changes
          </button>
        </div>
      </div>
    </div>
  );
}
