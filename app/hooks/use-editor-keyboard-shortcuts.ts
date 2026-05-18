"use client";

import { useEffect } from "react";

type EditorShortcutHandlers = {
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
};

export function useEditorKeyboardShortcuts({
  onSave,
  onUndo,
  onRedo,
}: EditorShortcutHandlers) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;

      const key = e.key.toLowerCase();
      if (key === "s") {
        e.preventDefault();
        onSave?.();
        return;
      }
      if (key === "z" && e.shiftKey) {
        e.preventDefault();
        onRedo?.();
        return;
      }
      if (key === "z") {
        e.preventDefault();
        onUndo?.();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onSave, onUndo, onRedo]);
}
