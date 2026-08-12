// Thin wrapper around GA4 (gtag) and Meta Pixel (fbq) - both are optional
// and only load if their env vars are set (see components/Analytics.tsx),
// so these calls are safe no-ops until real tracking IDs are configured.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export type AnalyticsEvent =
  | "page_view"
  | "service_page_view"
  | "whatsapp_click"
  | "enquiry_form_start"
  | "enquiry_form_submit"
  | "cta_click";

export function trackEvent(name: AnalyticsEvent, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", name, params);
    window.fbq?.("trackCustom", name, params);
  } catch {
    // analytics must never break the page
  }
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;
export type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>>;

const UTM_STORAGE_KEY = "intercoutra_utm";

export function captureUtmFromLocation() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const found: UtmParams = {};
  let hasAny = false;
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) {
      found[key] = value;
      hasAny = true;
    }
  }
  if (hasAny) {
    try {
      window.localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(found));
    } catch {
      // ignore storage errors (private browsing, etc.)
    }
  }
}

export function getStoredUtm(): UtmParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(UTM_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UtmParams) : {};
  } catch {
    return {};
  }
}
