const RESTAURANT_CAMPAIGNS_INDEX = /^\/restaurant\/\d+\/dashboard\/campaigns$/;

const RESTAURANT_CAMPAIGN_WORKSPACE =
  /^\/restaurant\/\d+\/dashboard\/campaigns\/\d+(?:\/.*)?$/;

export function isRestaurantCampaignsIndex(pathname: string): boolean {
  return RESTAURANT_CAMPAIGNS_INDEX.test(pathname);
}

export function isRestaurantCampaignWorkspace(pathname: string): boolean {
  return RESTAURANT_CAMPAIGN_WORKSPACE.test(pathname);
}

export function isRestaurantSidebarChromeMinimal(pathname: string): boolean {
  return (
    isRestaurantCampaignsIndex(pathname) ||
    isRestaurantCampaignWorkspace(pathname)
  );
}

export function shouldHideRestaurantNavbarHome(pathname: string): boolean {
  return isRestaurantCampaignWorkspace(pathname);
}
