export function resolveAutomationNumericId(param: string): number | null {
  const trimmed = param.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const n = Number.parseInt(trimmed, 10);
  return n >= 1 ? n : null;
}
