"use client";

import type { ReactNode } from "react";
import {
  editorCanvasSlotClass,
  editorNavbarSlotClass,
  editorSettingsSlotClass,
  editorShellClass,
  editorShellGridClass,
  editorSidebarSlotClass,
} from "@/app/components/crm-template-editor/editor-layout";

export function EditorShell({
  navbar,
  leftSidebar,
  canvas,
  settingsPanel,
}: {
  navbar: ReactNode;
  leftSidebar: ReactNode;
  canvas: ReactNode;
  settingsPanel: ReactNode;
}) {
  return (
    <div className={editorShellClass}>
      <div className={editorShellGridClass}>
        <div className={editorSidebarSlotClass}>{leftSidebar}</div>
        <div className={editorNavbarSlotClass}>{navbar}</div>
        <div className={editorCanvasSlotClass}>{canvas}</div>
        <div className={editorSettingsSlotClass}>{settingsPanel}</div>
      </div>
    </div>
  );
}
