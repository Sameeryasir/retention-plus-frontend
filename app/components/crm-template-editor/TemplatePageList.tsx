"use client";

import { EditorPageItem } from "@/app/components/crm-template-editor/editor-ui/EditorPageItem";
import { FUNNEL_STEP_META } from "@/app/components/crm-template-editor/editor-ui/funnel-step-meta";
import type { TemplatePageId } from "@/app/components/crm-template-editor/template-types";

export const FUNNEL_PAGE_ORDER: TemplatePageId[] = [
  "landing",
  "signup",
  "payment",
  "confirmation",
];

export function TemplatePageList({
  activeId,
  onSelect,
  onEditPage,
}: {
  activeId: TemplatePageId;
  onSelect: (id: TemplatePageId) => void;
  onEditPage: (id: TemplatePageId) => void;
}) {
  return (
    <nav className="px-2.5 py-3 [&_button]:cursor-pointer">
      <ul className="space-y-3">
        {FUNNEL_STEP_META.map((step) => (
          <li key={step.id}>
            <EditorPageItem
              title={step.title}
              description={step.description}
              icon={step.icon}
              selected={activeId === step.id}
              onSelect={() => onSelect(step.id)}
              onEdit={() => onEditPage(step.id)}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
