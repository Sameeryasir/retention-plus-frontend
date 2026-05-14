import { Suspense } from "react";
import { LandingFunnelPreview } from "@/app/components/LandingFunnelPreview";

export default function FunnelCampaignLandingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-zinc-100">
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="flex flex-1 flex-col justify-center px-3 py-8 sm:px-4">
          <div className="mx-auto w-full max-w-[390px] shrink-0">
            <Suspense
              fallback={
                <div className="py-16 text-center text-sm text-zinc-500">
                  Loading…
                </div>
              }
            >
              <LandingFunnelPreview />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
