"use client";

import { GuestPassView } from "@/app/components/pass/GuestPassView";
import { useParams } from "next/navigation";

export default function SignupGuestPassPage() {
  const params = useParams<{ customerId: string; funnelId: string }>();
  const customerId = Number(params.customerId);
  const funnelId = Number(params.funnelId);

  if (!Number.isFinite(customerId) || customerId < 1) {
    return null;
  }
  if (!Number.isFinite(funnelId) || funnelId < 1) {
    return null;
  }

  return <GuestPassView customerId={customerId} funnelId={funnelId} />;
}
