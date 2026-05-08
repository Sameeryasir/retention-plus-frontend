"use client";

import { useCallback, useMemo, useState } from "react";
import { PaymentCheckoutPreviewMock } from "@/app/components/campaign-funnel/PaymentCheckoutPreviewMock";
import { INITIAL_PAGES } from "@/app/components/campaign-funnel/funnel-data";

export default function Page() {
  const { landing, payment } = useMemo(() => {
    const l = INITIAL_PAGES.find((p) => p.id === "landing");
    const pay = INITIAL_PAGES.find((p) => p.id === "payment");
    return {
      landing: { ...(l ?? INITIAL_PAGES[0]) },
      payment: { ...(pay ?? INITIAL_PAGES[0]) },
    };
  }, []);

  const [landingPage] = useState(landing);
  const [paymentPage, setPaymentPage] = useState(payment);

  const onPatch = useCallback((patch) => {
    setPaymentPage((prev) => ({ ...prev, ...patch }));
  }, []);

  return (
    <PaymentCheckoutPreviewMock
      page={paymentPage}
      heroImageSrc={landingPage.heroImageSrc}
      editable={false}
      fullPage
      onPatch={onPatch}
    />
  );
}
