"use client";

import { CrmTemplateEditor } from "@/app/components/crm-template-editor/CrmTemplateEditor";

export default function Page() {
  return (
    <div className="h-dvh min-h-0 w-full">
      <CrmTemplateEditor initialPageId="landing" interactivePreview />
    </div>
  );
}
