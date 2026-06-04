"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  Check,
  Loader2,
} from "lucide-react";
import {
  formatMetaDailyBudget,
  formatMetaDeliveryStatus,
  formatMetaSpend,
} from "@/app/lib/format-meta-ads";
import { getSetupAccessToken } from "@/app/lib/setup-access-token";
import { connectFacebook } from "@/app/services/facebook/connect-facebook";
import {
  getFacebookAdCampaignStats,
  type FacebookAdCampaignStats,
} from "@/app/services/facebook/get-facebook-ad-campaign-stats";
import { getFacebookConnectionStatus } from "@/app/services/facebook/get-facebook-connection-status";

type CampaignAdsPanelProps = {
  restaurantId: number;
};

export function CampaignAdsPanel({ restaurantId }: CampaignAdsPanelProps) {
  const [metaConnected, setMetaConnected] = useState(false);
  const [metaAdAccountId, setMetaAdAccountId] = useState<string | null>(null);
  const [metaLoading, setMetaLoading] = useState(true);
  const [connectLoading, setConnectLoading] = useState(false);
  const [metaError, setMetaError] = useState<string | null>(null);
  const [adStats, setAdStats] = useState<FacebookAdCampaignStats | null>(null);
  const [adStatsLoading, setAdStatsLoading] = useState(false);
  const [adStatsError, setAdStatsError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    setAdStatsLoading(true);
    setAdStatsError(null);
    try {
      const stats = await getFacebookAdCampaignStats(restaurantId);
      setAdStats(stats);
    } catch (e) {
      setAdStats(null);
      setAdStatsError(
        e instanceof Error ? e.message : "Could not load Facebook ads.",
      );
    } finally {
      setAdStatsLoading(false);
    }
  }, [restaurantId]);

  const refreshConnection = useCallback(async () => {
    setMetaLoading(true);
    setMetaError(null);
    try {
      const token = getSetupAccessToken().trim();
      if (!token) {
        setMetaConnected(false);
        setMetaAdAccountId(null);
        return { connected: false, metaAdAccountId: null as string | null };
      }
      const status = await getFacebookConnectionStatus(token, restaurantId);
      setMetaConnected(status.connected);
      setMetaAdAccountId(status.metaAdAccountId);
      return {
        connected: status.connected,
        metaAdAccountId: status.metaAdAccountId,
      };
    } catch (e) {
      setMetaConnected(false);
      setMetaAdAccountId(null);
      setMetaError(
        e instanceof Error ? e.message : "Could not check Facebook.",
      );
      return { connected: false, metaAdAccountId: null as string | null };
    } finally {
      setMetaLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    void (async () => {
      const { connected, metaAdAccountId: accountId } =
        await refreshConnection();
      if (connected && accountId) {
        await loadStats();
      }
    })();
  }, [refreshConnection, loadStats]);

  const handleConnect = async () => {
    setConnectLoading(true);
    setMetaError(null);
    try {
      const token = getSetupAccessToken().trim();
      if (!token) throw new Error("Sign in again to connect Facebook.");
      const { url } = await connectFacebook(token, restaurantId);
      window.location.href = url;
    } catch (e) {
      setConnectLoading(false);
      setMetaError(
        e instanceof Error ? e.message : "Could not connect Facebook.",
      );
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-2xl">
        <h2 className="text-lg font-semibold text-zinc-900">Facebook ads</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Your Meta ad campaigns for this restaurant (last 30 days).
        </p>

        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          {metaLoading ? (
            <p className="flex items-center gap-2 text-sm text-zinc-500">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Checking Facebook…
            </p>
          ) : null}

          {!metaLoading && !metaConnected ? (
            <div className="space-y-4">
              <p className="text-sm text-zinc-600">
                Connect Facebook to load your ad campaigns here.
              </p>
              <button
                type="button"
                onClick={() => void handleConnect()}
                disabled={connectLoading}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#1877F2] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#166fe5] disabled:opacity-60"
              >
                {connectLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Connecting…
                  </>
                ) : (
                  "Connect with Facebook"
                )}
              </button>
            </div>
          ) : null}

          {!metaLoading && metaConnected && !metaAdAccountId ? (
            <div className="space-y-4">
              <p className="flex items-center gap-2 text-sm font-medium text-emerald-800">
                <Check className="size-4 shrink-0" aria-hidden />
                Facebook is linked
              </p>
              <p className="text-sm text-zinc-600">
                Choose which Meta ad account belongs to this restaurant.
              </p>
              <Link
                href={`/facebook/select-ad-account?restaurantId=${restaurantId}`}
                className="inline-flex rounded-xl bg-[#1877F2] px-4 py-2.5 text-sm font-semibold text-white no-underline hover:bg-[#166fe5]"
              >
                Choose ad account
              </Link>
            </div>
          ) : null}

          {!metaLoading && metaConnected && metaAdAccountId ? (
            <div className="space-y-4">
              <p className="flex items-center gap-2 text-sm font-medium text-emerald-800">
                <Check className="size-4 shrink-0" aria-hidden />
                Facebook is linked
              </p>
              <p className="text-xs text-zinc-500">
                Ad account: {metaAdAccountId.replace(/^act_/, "")}
                {" · "}
                <Link
                  href={`/facebook/select-ad-account?restaurantId=${restaurantId}`}
                  className="font-medium text-zinc-700 underline underline-offset-2"
                >
                  Change
                </Link>
              </p>

              {adStatsLoading ? (
                <p className="flex items-center gap-2 text-sm text-zinc-500">
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Loading campaigns…
                </p>
              ) : null}

              {!adStatsLoading &&
              adStats &&
              adStats.campaigns.length > 0 ? (
                <ul className="space-y-3">
                  {adStats.campaigns.map((c) => (
                    <li
                      key={c.id}
                      className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3"
                    >
                      <p className="font-semibold text-zinc-900">{c.name}</p>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-zinc-600">
                        <span>Status</span>
                        <span className="text-right font-medium text-zinc-900">
                          {formatMetaDeliveryStatus(c.effectiveStatus)}
                        </span>
                        <span>Spent</span>
                        <span className="text-right font-medium text-zinc-900">
                          {formatMetaSpend(
                            c.insights?.spend,
                            adStats.currency,
                          )}
                        </span>
                        {c.dailyBudget ? (
                          <>
                            <span>Budget</span>
                            <span className="text-right font-medium text-zinc-900">
                              {formatMetaDailyBudget(
                                c.dailyBudget,
                                adStats.currency,
                              )}
                            </span>
                          </>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}

              {!adStatsLoading &&
              adStats &&
              adStats.campaigns.length === 0 ? (
                <p className="text-sm text-zinc-600">
                  No campaigns in Meta yet.
                </p>
              ) : null}

              <button
                type="button"
                onClick={() => void loadStats()}
                disabled={adStatsLoading}
                className="cursor-pointer rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 disabled:opacity-60"
              >
                Refresh stats
              </button>
            </div>
          ) : null}

          {adStatsError ? (
            <div className="mt-4 space-y-3" role="alert">
              <p className="flex items-start gap-2 text-sm text-red-700">
                <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                {adStatsError}
              </p>
              <p className="text-xs text-zinc-600">
                If this keeps happening: reconnect Facebook under Settings →
                Integrations, and make sure your API server (port 4001) can
                reach the internet.
              </p>
              <button
                type="button"
                onClick={() => void loadStats()}
                disabled={adStatsLoading}
                className="cursor-pointer rounded-lg border border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 disabled:opacity-60"
              >
                Try again
              </button>
            </div>
          ) : null}
          {metaError ? (
            <p
              className="mt-4 flex items-start gap-2 text-sm text-red-700"
              role="alert"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
              {metaError}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
