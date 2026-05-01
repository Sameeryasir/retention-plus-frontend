"use client";

import type { VerifyOtpUser } from "@/app/services/auth/verify-otp";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "accessToken";
const USER_STORAGE_KEY = "user";

function readUserFromStorage(): VerifyOtpUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as VerifyOtpUser;
  } catch {
    return null;
  }
}

function isUserAdmin(user: VerifyOtpUser | null): boolean {
  return user?.role?.name === "Admin";
}

export type AuthContextType = {
  token: string | null;
  user: VerifyOtpUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (token: string, user: VerifyOtpUser, redirectTo?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<VerifyOtpUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = useMemo(() => isUserAdmin(user), [user]);

  useEffect(() => {
    const legacy = localStorage.getItem("token");
    const stored = localStorage.getItem(STORAGE_KEY);
    const value = stored ?? legacy ?? null;
    if (legacy && !stored) {
      localStorage.setItem(STORAGE_KEY, legacy);
      localStorage.removeItem("token");
    }
    setToken(value);
    setUser(readUserFromStorage());
    setIsLoading(false);
  }, []);

  const login = useCallback(
    (nextToken: string, nextUser: VerifyOtpUser, redirectTo?: string) => {
      localStorage.setItem(STORAGE_KEY, nextToken);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
      setToken(nextToken);
      setUser(nextUser);
      queueMicrotask(() => {
        if (redirectTo) {
          router.push(redirectTo);
          return;
        }
        if (isUserAdmin(nextUser)) {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
      });
    },
    [router],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("token");
    localStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUser(null);
    router.push("/auth/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAdmin,
        isLoading,
        login,
        logout,
        isAuthenticated: Boolean(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
