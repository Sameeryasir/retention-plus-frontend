"use client";

import type { EditorSaveStatus } from "@/app/components/crm-template-editor/editor-status";
import { editorStatusLabel } from "@/app/components/crm-template-editor/editor-status";

export function StatusBadge({
  status,
  isDirty,
}: {
  status: EditorSaveStatus;
  isDirty: boolean;
}) {
  const label = editorStatusLabel(status, isDirty);
  const tone =
    status === "error"
      ? "bg-rose-50 text-rose-700 ring-rose-200/80"
      : status === "saving"
        ? "bg-amber-50 text-amber-800 ring-amber-200/80"
        : status === "saved"
          ? "bg-emerald-50 text-emerald-800 ring-emerald-200/80"
          : isDirty
            ? "bg-violet-50 text-violet-800 ring-violet-200/80"
            : "bg-slate-100 text-slate-600 ring-slate-200/80";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.625rem] font-semibold ring-1 ring-inset ${tone}`}
      aria-live="polite"
    >
      {label}
    </span>
  );
}
