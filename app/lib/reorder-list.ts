export function reorderList<T>(list: T[], fromIndex: number, toIndex: number): T[] {
  if (fromIndex < 0 || fromIndex >= list.length) return list;
  if (fromIndex === toIndex) return list;
  const next = [...list];
  const [moved] = next.splice(fromIndex, 1);
  const insertAt = Math.max(0, Math.min(toIndex, next.length));
  next.splice(insertAt, 0, moved);
  return next;
}
