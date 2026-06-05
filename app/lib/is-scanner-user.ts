import { getSetupUser } from "@/app/lib/setup-user";

export function isScannerUser(): boolean {
  const roleName = getSetupUser()?.role?.name;
  if (!roleName) return false;
  return roleName.trim().toLowerCase() === "scanner";
}
