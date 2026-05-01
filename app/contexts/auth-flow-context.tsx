"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AuthFlowContextValue = {
  pendingLoginEmail: string | null;
  setPendingLoginEmail: (email: string | null) => void;
  pendingLoginPassword: string | null;
  setPendingLoginPassword: (password: string | null) => void;
};

const AuthFlowContext = createContext<AuthFlowContextValue | null>(null);

export function AuthFlowProvider({ children }: { children: ReactNode }) {
  const [pendingLoginEmail, setPendingLoginEmail] = useState<string | null>(
    null,
  );
  const [pendingLoginPassword, setPendingLoginPassword] = useState<
    string | null
  >(null);

  const value = useMemo(
    () => ({
      pendingLoginEmail,
      setPendingLoginEmail,
      pendingLoginPassword,
      setPendingLoginPassword,
    }),
    [pendingLoginEmail, pendingLoginPassword],
  );

  return (
    <AuthFlowContext.Provider value={value}>{children}</AuthFlowContext.Provider>
  );
}

export function useAuthFlow(): AuthFlowContextValue {
  const ctx = useContext(AuthFlowContext);
  if (!ctx) {
    throw new Error("useAuthFlow must be used within AuthFlowProvider");
  }
  return ctx;
}
