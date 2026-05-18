/** Normalize user hex input; empty means use the page design preset. */
export function normalizeHexColor(value: string | undefined | null): string {
  const raw = value?.trim() ?? "";
  if (!raw) return "";
  const withHash = raw.startsWith("#") ? raw : `#${raw}`;
  if (/^#[0-9A-Fa-f]{3}$/.test(withHash)) {
    const r = withHash[1];
    const g = withHash[2];
    const b = withHash[3];
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  if (/^#[0-9A-Fa-f]{6}$/.test(withHash)) {
    return withHash.toUpperCase();
  }
  return "";
}

export function textColorStyle(
  custom: string | undefined | null,
): { color: string } | undefined {
  const hex = normalizeHexColor(custom);
  return hex ? { color: hex } : undefined;
}

export function colorInputValue(custom: string | undefined | null, fallback: string): string {
  return normalizeHexColor(custom) || fallback;
}
