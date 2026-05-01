import { AuthFlowProvider } from "@/app/contexts/auth-flow-context";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthFlowProvider>{children}</AuthFlowProvider>;
}
