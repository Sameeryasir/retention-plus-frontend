"use client";

import { motion } from "framer-motion";
import { getBlockByKind } from "@/app/components/automation/mock-data";
import { nodeToneClass } from "@/app/components/automation/automation-ui";
import type { WorkflowNode } from "@/app/components/automation/types";

export function WorkflowNodeCard({
  node,
  selected,
  isDragging = false,
  isPressing = false,
  isGhost = false,
}: {
  node: WorkflowNode;
  selected: boolean;
  isDragging?: boolean;
  isPressing?: boolean;
  isGhost?: boolean;
}) {
  const block = getBlockByKind(node.kind);
  const tone = nodeToneClass(block.tone);
  const Icon = block.icon;

  return (
    <motion.div
      className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition select-none ${tone.shell} ${
        isGhost
          ? "scale-[1.03] shadow-2xl ring-2 ring-violet-400"
          : `shadow-md ${selected ? `ring-2 ${tone.ring}` : "ring-1 ring-zinc-950/[0.04]"}`
      } ${isDragging ? "opacity-30" : ""} ${
        isPressing && !isDragging && !isGhost ? "scale-[0.99] ring-2 ring-violet-200" : ""
      }`}
      animate={isGhost ? { scale: 1.03 } : isDragging ? { opacity: 0.3 } : { scale: 1 }}
    >
      <span
        className={`flex size-10 shrink-0 items-center justify-center rounded-xl shadow-sm ${tone.icon}`}
      >
        <Icon className="size-5" strokeWidth={2} aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[0.65rem] font-bold uppercase tracking-wide text-zinc-500">
          {block.section === "triggers"
            ? "Trigger"
            : block.section === "conditions"
              ? "Condition"
              : block.section === "flow"
                ? "Flow"
                : "Action"}
        </span>
        <span className="mt-0.5 block text-base font-semibold text-zinc-900">
          {node.label}
        </span>
      </span>
    </motion.div>
  );
}
