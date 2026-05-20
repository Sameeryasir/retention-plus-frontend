"use client";

import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/app/components/ConfirmDialog";

export function DeleteExecutionDialog({
  open,
  isDeleting,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <ConfirmDialog
      open={open}
      tone="danger"
      icon={Trash2}
      titleId="delete-execution-title"
      title="Delete this run?"
      description="This run and its activity logs will be removed permanently. This cannot be undone."
      confirmLabel="Delete run"
      isLoading={isDeleting}
      loadingLabel="Deleting…"
      confirmCheckbox={{
        label: "I understand this cannot be undone",
      }}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
