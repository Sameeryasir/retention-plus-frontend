"use client";

import {
  editorSettingsPanelScrollClass,
  editorSettingsPanelShellClass,
} from "@/app/components/crm-template-editor/editor-sidebar-theme";
import { editorCardClass } from "@/app/components/crm-template-editor/editor-theme";
import { TemplateEditorSidebar } from "@/app/components/crm-template-editor/TemplateEditorSidebar";
import type {
  TemplatePage,
  TemplatePagePatch,
} from "@/app/components/crm-template-editor/template-types";

export function SettingsPanel({
  page,
  onChange,
  open,
  onBrowseTemplates,
}: {
  page: TemplatePage;
  onChange: (patch: TemplatePagePatch) => void;
  open: boolean;
  onBrowseTemplates?: () => void;
}) {
  if (!open) {
    return (
      <aside
        className={`${editorSettingsPanelShellClass} ${editorCardClass} !shadow-none`}
      >
        <p className="flex flex-1 items-center justify-center p-6 text-center text-sm text-zinc-500">
          Select a page and click edit to customize settings.
        </p>
      </aside>
    );
  }

  return (
    <aside
      className={`${editorSettingsPanelShellClass} ${editorCardClass} !shadow-none`}
    >
      <div className={editorSettingsPanelScrollClass}>
        <TemplateEditorSidebar
          page={page}
          onChange={onChange}
          onBrowseTemplates={onBrowseTemplates}
        />
      </div>
    </aside>
  );
}
