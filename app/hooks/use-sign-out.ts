"use client";

import { useAuth } from "@/app/contexts/auth-context";
import { useCallback } from "react";

export function useSignOut() {
  const { logout } = useAuth();
  return useCallback(() => {
    logout();
  }, [logout]);
}
