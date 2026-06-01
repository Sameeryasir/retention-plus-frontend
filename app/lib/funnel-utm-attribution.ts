const UTM_STORAGE_KEY = "funnelUtmAttribution";

export type FunnelUtmAttribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
};

function readSearchParams(): URLSearchParams | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search);
}

export function captureFunnelUtmAttribution(): FunnelUtmAttribution {
  if (typeof window === "undefined") return {};

  const params = readSearchParams();
  const fromUrl: FunnelUtmAttribution = {
    utmSource: params?.get("utm_source")?.trim() || undefined,
    utmMedium: params?.get("utm_medium")?.trim() || undefined,
    utmCampaign: params?.get("utm_campaign")?.trim() || undefined,
    referrer: document.referrer?.trim() || undefined,
  };

  const hasUrlUtm =
    fromUrl.utmSource || fromUrl.utmMedium || fromUrl.utmCampaign || fromUrl.referrer;

  if (hasUrlUtm) {
    window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(fromUrl));
    return fromUrl;
  }

  const stored = window.sessionStorage.getItem(UTM_STORAGE_KEY);
  if (!stored) return {};
  try {
    return JSON.parse(stored) as FunnelUtmAttribution;
  } catch {
    return {};
  }
}
