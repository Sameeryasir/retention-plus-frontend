"use client";

import { useCallback, useMemo, useState } from "react";
import { CampaignFunnelSignupPhone } from "@/app/components/campaign-funnel/CampaignFunnelSignupPhone";
import { INITIAL_PAGES } from "@/app/components/campaign-funnel/funnel-data";

export default function Page() {
  const { landing, signup } = useMemo(() => {
    const l = INITIAL_PAGES.find((p) => p.id === "landing");
    const s = INITIAL_PAGES.find((p) => p.id === "signup");
    return {
      landing: { ...(l ?? INITIAL_PAGES[0]) },
      signup: { ...(s ?? INITIAL_PAGES[0]) },
    };
  }, []);

  const [landingPage] = useState(landing);
  const [signupPage, setSignupPage] = useState(signup);

  const onPatch = useCallback((patch) => {
    setSignupPage((prev) => ({ ...prev, ...patch }));
  }, []);

  return (
    <CampaignFunnelSignupPhone
      signupPage={signupPage}
      landingPage={landingPage}
      editing={false}
      fullPage
      backHref="/funnel/landing-page"
      continueHref="/funnel/payment"
      onPatch={onPatch}
    />
  );
}
