export const ANALYTICS_EVENT_TYPES = {
  PAGE_VIEW: "page_view",
  BUTTON_CLICK: "button_click",
  SCROLL: "scroll",
  FORM_START: "form_start",
  CHECKOUT_OPEN: "checkout_open",
  VIDEO_PLAY: "video_play",
  EXIT_INTENT: "exit_intent",
} as const;

export type AnalyticsEventType =
  (typeof ANALYTICS_EVENT_TYPES)[keyof typeof ANALYTICS_EVENT_TYPES];
