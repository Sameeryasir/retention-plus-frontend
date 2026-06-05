"use client";

import { formatDateTimeShort } from "@/app/lib/datetime";
import type { ScanPreviewSuccess } from "@/app/services/redemption/scan-redemption";

type ScanCustomerConfirmDialogProps = {
  preview: ScanPreviewSuccess;
  confirming: boolean;
  showPreviousRedemptions: boolean;
  onTogglePreviousRedemptions: () => void;
  onConfirm: () => void;
  onDismiss: () => void;
};

export function ScanCustomerConfirmDialog({
  preview,
  confirming,
  showPreviousRedemptions,
  onTogglePreviousRedemptions,
  onConfirm,
  onDismiss,
}: ScanCustomerConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      role="presentation"
      onClick={onDismiss}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="scan-customer-title"
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          id="scan-customer-title"
          className="text-2xl font-semibold tracking-tight text-zinc-900"
        >
          {preview.customerName}
        </h2>

        <ul className="mt-5 list-disc space-y-2 pl-5 text-sm text-zinc-800">
          <li>
            {preview.totalVisits} total visit{preview.totalVisits === 1 ? "" : "s"}
          </li>
          <li>
            {preview.rewardsAvailable} reward
            {preview.rewardsAvailable === 1 ? "" : "s"} available
          </li>
          <li>
            {preview.upcomingRewardsCount > 0
              ? `${preview.upcomingRewardsCount} upcoming reward${preview.upcomingRewardsCount === 1 ? "" : "s"}`
              : "No upcoming rewards found"}
          </li>
        </ul>

        {preview.previouslyRedeemedCount > 0 ? (
          <div className="mt-5">
            <button
              type="button"
              onClick={onTogglePreviousRedemptions}
              className="rounded-lg border border-zinc-900 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
            >
              Show {preview.previouslyRedeemedCount} previously redeemed reward
              {preview.previouslyRedeemedCount === 1 ? "" : "s"}
            </button>

            {showPreviousRedemptions ? (
              <ul className="mt-3 space-y-2 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700">
                {preview.previousRedemptions.map((item, index) => (
                  <li key={`${item.campaignName}-${item.redeemedAt}-${index}`}>
                    <span className="font-medium text-zinc-900">
                      {item.campaignName}
                    </span>
                    {item.redeemedAt ? (
                      <span className="text-zinc-500">
                        {" "}
                        · {formatDateTimeShort(item.redeemedAt)}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        <div className="my-6 border-t border-zinc-200" />

        <p className="text-base font-semibold text-zinc-900">
          Are they redeeming an offer/reward today?
        </p>

        {preview.redeemBlockedReason ? (
          <p className="mt-2 text-sm text-red-600">{preview.redeemBlockedReason}</p>
        ) : null}

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onDismiss}
            disabled={confirming}
            className="min-w-24 rounded-lg border border-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50 disabled:opacity-50"
          >
            No
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={
              confirming ||
              !(
                preview.canRedeem ||
                preview.availableRewards?.some((reward) => reward.canSelect)
              )
            }
            className="min-w-24 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
