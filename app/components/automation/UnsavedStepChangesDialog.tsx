"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect, useId } from "react";

export type UnsavedStepChangesDialogProps = {
  open: boolean;
  stepLabel?: string;
  isLoading?: boolean;
  onKeepEditing: () => void;
  onDiscard: () => void;
  onActivate: () => void;
};

export function UnsavedStepChangesDialog({
  open,
  stepLabel,
  isLoading = false,
  onKeepEditing,
  onDiscard,
  onActivate,
}: UnsavedStepChangesDialogProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open || isLoading) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onKeepEditing();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, isLoading, onKeepEditing]);

  if (!open) return null;

  const label = stepLabel?.trim() || "this step";

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        aria-label="Close dialog"
        disabled={isLoading}
        onClick={onKeepEditing}
        className="absolute inset-0 cursor-default bg-zinc-900/50 backdrop-blur-[2px]"
      />

      <div className="relative w-full max-w-[26rem] overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-xl ring-1 ring-black/5">
        <div className="h-0.5 bg-amber-500" aria-hidden />

        <div className="px-5 pb-4 pt-5 sm:px-6">
          <div className="flex gap-4">
            <span
              className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-amber-200/80 bg-amber-50 text-amber-800 shadow-sm"
              aria-hidden
            >
              <AlertTriangle className="size-5" strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <h2
                id={titleId}
                className="text-base font-semibold leading-snug text-zinc-900"
              >
                Unsaved step changes
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">
                You edited <span className="font-medium text-zinc-700">{label}</span>{" "}
                but did not save. Discard those edits or activate the automation to
                save everything and turn it on.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-zinc-100 bg-zinc-50/50 px-5 py-3.5 sm:px-6">
          <button
            type="button"
            disabled={isLoading}
            onClick={onActivate}
            className="h-10 w-full cursor-pointer rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-black active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Activating…" : "Activate automation"}
          </button>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-2.5">
            <button
              type="button"
              disabled={isLoading}
              onClick={onKeepEditing}
              autoFocus
              className="h-10 cursor-pointer rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50 sm:min-w-[6.5rem]"
            >
              Keep editing
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={onDiscard}
              className="h-10 cursor-pointer rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50 sm:min-w-[6.5rem]"
            >
              Discard changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
