"use client";

import { editorPanelScrollClass } from "@/app/components/crm-template-editor/editor-layout";
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
        className={`hidden h-full min-h-0 flex-col border-l border-slate-200/90 bg-white lg:flex ${editorCardClass} !rounded-none !border-y-0 !border-r-0 !shadow-none`}
      >
        <p className="flex flex-1 items-center justify-center bg-white p-6 text-center text-sm text-[#6B7280]">
          Select a page and click edit to customize settings.
        </p>
      </aside>
    );
  }

  return (
    <aside
      className={`hidden h-full min-h-0 flex-col overflow-hidden border-l border-slate-200/90 bg-gradient-to-b from-white to-slate-50/80 lg:flex ${editorCardClass} !rounded-none !border-y-0 !border-r-0 !shadow-none`}
    >
      <div className={`${editorPanelScrollClass} min-h-0 max-h-full`}>
        <TemplateEditorSidebar
          page={page}
          onChange={onChange}
          onBrowseTemplates={onBrowseTemplates}
        />
      </div>
    </aside>
  );
}
