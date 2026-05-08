"use client";

import { useCallback, useMemo, useState } from "react";
import { CampaignFunnelLandingPhone } from "@/app/components/campaign-funnel/CampaignFunnelLandingPhone";
import { INITIAL_PAGES } from "@/app/components/campaign-funnel/funnel-data";

export default function Page() {
  const initialLanding = useMemo(() => {
    const landing = INITIAL_PAGES.find((p) => p.id === "landing");
    return { ...(landing ?? INITIAL_PAGES[0]) };
  }, []);

  const [page, setPage] = useState(initialLanding);

  const onPatch = useCallback((patch) => {
    setPage((prev) => ({ ...prev, ...patch }));
  }, []);

  const onHeroFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const out = reader.result;
      if (typeof out === "string") {
        setPage((prev) => ({ ...prev, heroImageSrc: out }));
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const onClearHero = useCallback(() => {
    setPage((prev) => ({ ...prev, heroImageSrc: null }));
  }, []);

  return (
    <CampaignFunnelLandingPhone
      page={page}
      editing={false}
      fullPage
      ctaHref="/funnel/signup"
      onPatch={onPatch}
      onHeroFileChange={onHeroFileChange}
      onClearHero={onClearHero}
    />
  );
}
