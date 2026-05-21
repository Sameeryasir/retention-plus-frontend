import type {
  WorkflowNode,
  WorkflowNodeKind,
} from "@/app/components/automation/types";

const TRIGGER_NODE_KINDS = new Set<WorkflowNodeKind>([
  "signup_trigger",
  "payment_trigger",
  "funnel_complete",
  "cron_trigger",
]);

export function isTriggerNodeKind(kind: WorkflowNodeKind): boolean {
  return TRIGGER_NODE_KINDS.has(kind);
}

export function workflowStartsWithTrigger(nodes: WorkflowNode[]): boolean {
  const first = nodes[0];
  return first != null && isTriggerNodeKind(first.kind);
}

export function workflowStartsWithCronTrigger(nodes: WorkflowNode[]): boolean {
  return nodes[0]?.kind === "cron_trigger";
}

export function nodeToneClass(
  tone: "emerald" | "blue" | "violet" | "orange" | "zinc" | "amber",
): { shell: string; icon: string; ring: string } {
  switch (tone) {
    case "emerald":
      return {
        shell: "border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-white",
        icon: "bg-emerald-500 text-white",
        ring: "ring-emerald-400/40",
      };
    case "blue":
      return {
        shell: "border-blue-200/80 bg-gradient-to-br from-blue-50 to-white",
        icon: "bg-blue-500 text-white",
        ring: "ring-blue-400/40",
      };
    case "violet":
      return {
        shell: "border-violet-200/80 bg-gradient-to-br from-violet-50 to-white",
        icon: "bg-violet-500 text-white",
        ring: "ring-violet-400/40",
      };
    case "orange":
      return {
        shell: "border-orange-200/80 bg-gradient-to-br from-orange-50 to-white",
        icon: "bg-orange-500 text-white",
        ring: "ring-orange-400/40",
      };
    case "amber":
      return {
        shell: "border-amber-200/80 bg-gradient-to-br from-amber-50 to-white",
        icon: "bg-amber-500 text-white",
        ring: "ring-amber-400/40",
      };
    default:
      return {
        shell: "border-zinc-200/90 bg-gradient-to-br from-zinc-50 to-white",
        icon: "bg-zinc-800 text-white",
        ring: "ring-zinc-400/40",
      };
  }
}
