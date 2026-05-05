"use client";

// --- Change summary ---
// Wired "Create campaign" to open the CreateCampaigns modal (controlled open state).
// Related: app/components/CreateCampaigns.tsx

import { useState } from "react";
import CreateCampaigns from "@/app/components/CreateCampaigns";

export default function RestaurantCampaignsPage() {
  // --- Create campaign modal ---
  // Lifted state so the empty-state button and CreateCampaigns stay in sync.
  const [createCampaignOpen, setCreateCampaignOpen] = useState(false);

  return (
    <div className="flex w-full min-h-[calc(100dvh-8rem)] items-center justify-center px-6 py-10 md:px-10">
      <div>
        <h1 className="sr-only">Campaigns</h1>
        <div className="w-full max-w-lg rounded-2xl border border-dashed border-zinc-200 bg-white px-6 py-14 text-center sm:px-10">
          <p className="text-sm leading-relaxed text-zinc-600 sm:text-base">
            You haven&apos;t created any campaigns yet. When you&apos;re ready,
            start with a new campaign.
          </p>
          <button
            type="button"
            className="mt-6 inline-flex h-11 cursor-pointer items-center justify-center rounded-xl bg-zinc-900 px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/30 focus-visible:ring-offset-2"
            onClick={() => setCreateCampaignOpen(true)}
          >
            Create campaign
          </button>
        </div>
      </div>

      <CreateCampaigns
        open={createCampaignOpen}
        onOpenChange={setCreateCampaignOpen}
      />
    </div>
  );
}
