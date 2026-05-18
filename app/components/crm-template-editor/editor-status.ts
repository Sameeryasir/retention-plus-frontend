export type EditorSaveStatus = "idle" | "saving" | "saved" | "error" | "draft";

export function editorStatusLabel(
  status: EditorSaveStatus,
  isDirty: boolean,
): string {
  if (status === "saving") return "Saving…";
  if (status === "error") return "Save failed";
  if (status === "saved") return "Saved";
  if (isDirty) return "Unsaved changes";
  return "Draft synced";
}
