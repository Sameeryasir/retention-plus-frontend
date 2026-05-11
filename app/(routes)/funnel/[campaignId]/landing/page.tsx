import { LandingFunnelPreview } from "@/app/components/LandingFunnelPreview";

export default function FunnelCampaignLandingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-zinc-100">
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="flex flex-1 flex-col justify-center px-3 py-8 sm:px-4">
          <div className="mx-auto w-full max-w-[390px] shrink-0">
            <LandingFunnelPreview />
          </div>
        </div>
      </main>
    </div>
  );
}
