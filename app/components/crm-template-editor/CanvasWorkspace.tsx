"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { editorMotion } from "@/app/components/crm-template-editor/editor-animation";
import { previewPhoneFrameClass } from "@/app/components/crm-template-editor/editor-layout";

export function CanvasWorkspace({
  isLoading,
  loadError,
  children,
}: {
  isLoading?: boolean;
  loadError?: string | null;
  children: ReactNode;
}) {
  return (
    <main className="relative flex min-h-0 min-w-0 flex-col overflow-hidden bg-zinc-50">
      <div className="relative flex h-full min-h-0 w-full flex-col items-center justify-center overflow-hidden p-2 sm:p-3 lg:p-4">
        {loadError ? (
          <motion.p
            {...editorMotion.slideUp}
            className="mx-auto mb-2 w-full max-w-[min(390px,100%)] rounded-2xl border border-amber-200/80 bg-amber-50/90 px-3 py-2 text-xs text-amber-950"
            role="status"
          >
            {loadError}
          </motion.p>
        ) : null}

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center gap-2 py-12 text-sm text-[#6B7280]">
            <Loader2 className="size-5 animate-spin text-[#5B5FEF]" aria-hidden />
            Loading funnel…
          </div>
        ) : (
          <motion.div
            className="flex h-full min-h-0 w-full max-w-[min(390px,100%)] items-start justify-center"
            {...editorMotion.scaleIn}
          >
            <div className={previewPhoneFrameClass}>{children}</div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
