export const funnelQueryKeys = {
  all: ["funnel"] as const,
  campaigns: () => [...funnelQueryKeys.all, "campaigns"] as const,
  campaignsByRestaurant: (restaurantId: number) =>
    [...funnelQueryKeys.campaigns(), restaurantId] as const,
  payments: () => [...funnelQueryKeys.all, "payments"] as const,
  paymentsByFunnel: (funnelId: number) =>
    [...funnelQueryKeys.payments(), funnelId] as const,
  eventStats: () => [...funnelQueryKeys.all, "event-stats"] as const,
  eventStatsByFunnel: (funnelId: number) =>
    [...funnelQueryKeys.eventStats(), funnelId] as const,
  analyticsOverview: () =>
    [...funnelQueryKeys.all, "analytics-overview"] as const,
  analyticsOverviewByFunnel: (funnelId: number) =>
    [...funnelQueryKeys.analyticsOverview(), funnelId] as const,
  dropoff: () => [...funnelQueryKeys.all, "dropoff"] as const,
  dropoffByFunnel: (funnelId: number) =>
    [...funnelQueryKeys.dropoff(), funnelId] as const,
  trafficSources: () => [...funnelQueryKeys.all, "traffic-sources"] as const,
  trafficSourcesByFunnel: (funnelId: number) =>
    [...funnelQueryKeys.trafficSources(), funnelId] as const,
};
