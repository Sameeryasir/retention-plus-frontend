"use client";

import { motion } from "framer-motion";
import { editorPanelScrollClass } from "@/app/components/crm-template-editor/editor-layout";
import { editorCardClass } from "@/app/components/crm-template-editor/editor-theme";
import {
  FUNNEL_PAGE_ORDER,
  TemplatePageList,
} from "@/app/components/crm-template-editor/TemplatePageList";
import type { TemplatePageId } from "@/app/components/crm-template-editor/template-types";

export function EditorLeftSidebar({
  pages,
  activeId,
  onSelect,
  onEditPage,
}: {
  pages: { id: TemplatePageId; label: string }[];
  activeId: TemplatePageId;
  onSelect: (id: TemplatePageId) => void;
  onEditPage: (id: TemplatePageId) => void;
}) {
  const stepIndex = FUNNEL_PAGE_ORDER.indexOf(activeId);
  const progress = ((stepIndex + 1) / FUNNEL_PAGE_ORDER.length) * 100;

  return (
    <aside
      className={`flex h-full min-h-0 flex-col border-r border-slate-200/90 bg-gradient-to-b from-white to-slate-50/80 ${editorCardClass} !rounded-none !border-y-0 !border-l-0 !shadow-none`}
    >
      <div className="shrink-0 border-b border-slate-100/90 px-2.5 py-3">
        <motion.p
          className="text-[0.75rem] font-semibold tracking-tight text-[#111827]"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          Funnel flow
        </motion.p>
        <motion.p
          className="mt-0.5 text-[0.65rem] text-[#6B7280]"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.28, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
          Step {stepIndex + 1} of {FUNNEL_PAGE_ORDER.length}
        </motion.p>
        <motion.div
          className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-zinc-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.08 }}
        >
          <motion.div
            className="h-full rounded-full bg-black"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      </div>

      <motion.div className={editorPanelScrollClass}>
        <TemplatePageList
          pages={pages}
          activeId={activeId}
          onSelect={onSelect}
          onEditPage={onEditPage}
        />
      </motion.div>
    </aside>
  );
}
