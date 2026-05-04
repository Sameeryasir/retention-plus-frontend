"use client";

import { useEffect, useId } from "react";

export type DeleteRestaurantDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurantName: string;
  onConfirm: () => void | Promise<void>;
};

export default function DeleteRestaurantDialog({
  open,
  onOpenChange,
  restaurantName,
  onConfirm,
}: DeleteRestaurantDialogProps) {
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  async function handleConfirm() {
    onOpenChange(false);
    await onConfirm();
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id={titleId} className="text-lg font-semibold text-zinc-900">
          Delete restaurant permanently?
        </h2>
        <p id={descId} className="mt-3 text-sm leading-relaxed text-zinc-600">
          This will permanently delete{" "}
          <span className="font-semibold text-zinc-900">{restaurantName}</span>.
          Make sure this is the restaurant you intend to remove. You cannot undo
          this action.
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-50"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
            onClick={() => void handleConfirm()}
          >
            Delete permanently
          </button>
        </div>
      </div>
    </div>
  );
}
