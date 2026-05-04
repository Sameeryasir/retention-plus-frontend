"use client";

import { clearSetupAccessToken } from "@/app/lib/setup-access-token";
import { clearSetupUser } from "@/app/lib/setup-user";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CredentialContextValue = {
  email: string;
  password: string;
  setCredentials: (email: string, password: string) => void;
  clearPassword: () => void;
};

const CredentialContext = createContext<CredentialContextValue | null>(null);

export function CredentialProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState("");
  const [password, setPasswordState] = useState("");

  const setCredentials = useCallback((nextEmail: string, nextPassword: string) => {
    setEmail(nextEmail);
    setPasswordState(nextPassword);
    clearSetupAccessToken();
    clearSetupUser();
  }, []);

  const clearPassword = useCallback(() => {
    setPasswordState("");
  }, []);

  const value = useMemo(
    () => ({
      email,
      password,
      setCredentials,
      clearPassword,
    }),
    [email, password, setCredentials, clearPassword],
  );

  return (
    <CredentialContext.Provider value={value}>
      {children}
    </CredentialContext.Provider>
  );
}

export function useCredentialContext(): CredentialContextValue {
  const ctx = useContext(CredentialContext);
  if (!ctx) {
    throw new Error(
      "useCredentialContext must be used within CredentialProvider",
    );
  }
  return ctx;
}
