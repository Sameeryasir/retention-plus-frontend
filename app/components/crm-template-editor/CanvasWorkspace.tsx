"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { editorMotion } from "@/app/components/crm-template-editor/editor-animation";
import { FunnelPreviewSkeleton } from "@/app/components/crm-template-editor/FunnelPreviewSkeleton";
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
    <main className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-zinc-50">
      <div className="relative flex min-h-0 flex-1 w-full flex-col items-center justify-start overflow-hidden p-2 sm:p-3 lg:justify-center lg:p-4 lg:py-10">
        {loadError ? (
          <motion.p
            {...editorMotion.slideUp}
            className="mb-3 w-full max-w-[min(390px,100%)] shrink-0 rounded-2xl border border-amber-200/80 bg-amber-50/90 px-3 py-2 text-xs text-amber-950"
            role="status"
          >
            {loadError}
          </motion.p>
        ) : null}

        {isLoading ? (
          <div className={previewPhoneFrameClass}>
            <FunnelPreviewSkeleton />
          </div>
        ) : (
          <motion.div className={previewPhoneFrameClass} {...editorMotion.scaleIn}>
            {children}
          </motion.div>
        )}
      </div>
    </main>
  );
}
