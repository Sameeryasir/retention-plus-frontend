export const checkoutFormRootClass = "w-full min-w-0 text-left";

export function checkoutFieldLabel(dark: boolean): string {
  return [
    "mb-1.5 block w-full text-left text-xs font-medium",
    dark ? "text-zinc-300" : "text-zinc-600",
  ].join(" ");
}

export function checkoutSectionTitle(dark: boolean): string {
  return [
    "text-left text-sm font-semibold tracking-tight",
    dark ? "text-white" : "text-zinc-900",
  ].join(" ");
}
