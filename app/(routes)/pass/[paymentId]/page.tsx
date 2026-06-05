"use client";

import { GuestPassView } from "@/app/components/pass/GuestPassView";
import { InvalidRouteMessage } from "@/app/components/InvalidRouteMessage";
import { parseRoutePositiveInt } from "@/app/lib/numbers";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export default function GuestPassPage() {
  const params = useParams();
  const paymentId = useMemo(
    () => parseRoutePositiveInt(params.paymentId),
    [params.paymentId],
  );

  if (paymentId == null) {
    return <InvalidRouteMessage />;
  }

  return <GuestPassView paymentId={paymentId} />;
}
