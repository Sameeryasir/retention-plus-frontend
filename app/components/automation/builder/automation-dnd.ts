import type { WorkflowNodeKind } from "@/app/components/automation/types";

export const AUTOMATION_BLOCK_DRAG_MIME = "application/x-automation-block";
export const AUTOMATION_NODE_DRAG_MIME = "application/x-automation-node";

export function setBlockDragData(
  dataTransfer: DataTransfer,
  blockId: WorkflowNodeKind,
): void {
  dataTransfer.setData(AUTOMATION_BLOCK_DRAG_MIME, blockId);
  dataTransfer.effectAllowed = "copy";
}

export function readBlockDragData(
  dataTransfer: DataTransfer,
): WorkflowNodeKind | null {
  const raw = dataTransfer.getData(AUTOMATION_BLOCK_DRAG_MIME);
  return raw ? (raw as WorkflowNodeKind) : null;
}

export function isBlockDrag(dataTransfer: DataTransfer): boolean {
  return Array.from(dataTransfer.types).includes(AUTOMATION_BLOCK_DRAG_MIME);
}

export function isNodeDrag(dataTransfer: DataTransfer): boolean {
  return Array.from(dataTransfer.types).includes(AUTOMATION_NODE_DRAG_MIME);
}

export function setNodeDragData(dataTransfer: DataTransfer, index: number): void {
  dataTransfer.setData(AUTOMATION_NODE_DRAG_MIME, String(index));
  dataTransfer.effectAllowed = "move";
}

export function readNodeDragIndex(dataTransfer: DataTransfer): number | null {
  const raw = dataTransfer.getData(AUTOMATION_NODE_DRAG_MIME);
  if (!raw) return null;
  const index = Number.parseInt(raw, 10);
  return Number.isFinite(index) ? index : null;
}

export function reorderList<T>(list: T[], fromIndex: number, toIndex: number): T[] {
  if (fromIndex < 0 || fromIndex >= list.length) return list;
  if (fromIndex === toIndex) return list;
  const next = [...list];
  const [moved] = next.splice(fromIndex, 1);
  const insertAt = Math.max(0, Math.min(toIndex, next.length));
  next.splice(insertAt, 0, moved);
  return next;
}
