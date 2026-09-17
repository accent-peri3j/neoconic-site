import { isCwPath } from "../app/data/curacao";

/** Public measurement ID, verified against the existing neoconic.com tag. */
export const REGIONAL_GA_ID = "G-ZSFS09L41L";
export const ANALYTICS_CONSENT_KEY = "neoconic-cookie-consent";
export const COOKIE_SETTINGS_EVENT = "neoconic-open-cookie-settings";

let regionalTagStarted = false;
let regionalInitialPageSent = false;
let regionalConsentAllowed = false;

function isRegionalProduction() {
  return typeof window !== "undefined" &&
    ["neoconic.com", "www.neoconic.com"].includes(window.location.hostname) &&
    isCwPath(window.location.pathname);
}

export function hasAnalyticsConsent() {
  try {
    return JSON.parse(localStorage.getItem(ANALYTICS_CONSENT_KEY) || "null")?.analytics === true;
  } catch {
    return false;
  }
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT));
}

function setRegionalDisabled(disabled: boolean) {
  (window as unknown as Record<string, unknown>)[`ga-disable-${REGIONAL_GA_ID}`] = disabled;
}

function expireAnalyticsCookies() {
  const domains = ["", window.location.hostname, ".neoconic.com", "neoconic.com"];
  for (const item of document.cookie.split(";")) {
    const name = item.trim().split("=")[0];
    if (!/^_ga(?:_|$)/.test(name)) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax; Secure${domain ? `; Domain=${domain}` : ""}`;
    }
  }
}

/** Basic consent: no Google script or requests before an affirmative choice. */
export function setRegionalAnalyticsConsent(allowed: boolean) {
  if (!isRegionalProduction()) return;

  if (!allowed) {
    regionalConsentAllowed = false;
    setRegionalDisabled(true);
    if (regionalTagStarted) {
      window.gtag?.("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
    }
    expireAnalyticsCookies();
    // A reload also removes the tag's already-installed automatic event listeners.
    if (regionalTagStarted && !hasAnalyticsConsent()) window.location.reload();
    return;
  }

  if (!hasAnalyticsConsent() || regionalTagStarted) return;
  regionalConsentAllowed = true;
  regionalTagStarted = true;
  setRegionalDisabled(false);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("consent", "update", { analytics_storage: "granted" });
  window.gtag("js", new Date());
  window.gtag("config", REGIONAL_GA_ID, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_flags: "SameSite=Lax;Secure",
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${REGIONAL_GA_ID}`;
  script.onload = () => {
    if (!regionalConsentAllowed || !hasAnalyticsConsent() || regionalInitialPageSent) return;
    regionalInitialPageSent = true;
    window.gtag?.("event", "page_view", {
      send_to: REGIONAL_GA_ID,
      page_location: window.location.href,
      page_path: window.location.pathname + window.location.search,
      page_title: document.title,
    });
  };
  script.onerror = () => {
    // Blockers are respected. A later explicit consent attempt can retry.
    script.remove();
    regionalTagStarted = false;
  };
  document.head.appendChild(script);
}

/** An intent to contact, never a claim that an email was sent or a lead received. */
export function trackContactIntent(method: "email" | "copy_email") {
  if (!isRegionalProduction() || !regionalConsentAllowed || !hasAnalyticsConsent() || !regionalTagStarted) return;
  window.gtag?.("event", "contact_intent", {
    send_to: REGIONAL_GA_ID,
    contact_method: method,
    site_region: "curacao",
  });
}

// Legacy global implementation remains unchanged; production serves its original bundle.
export function loadGA(onReady?: () => void) {
  if (["localhost", "127.0.0.1", "::1", "[::1]"].includes(window.location.hostname)) return;
  const GA_ID = import.meta.env.VITE_GA_ID;
  if (!GA_ID) return;

  // Already loaded
  if (document.querySelector(`script[src*="${GA_ID}"]`)) {
    onReady?.();
    return;
  }

  window.dataLayer = window.dataLayer || [];
  // Must use `arguments`, not rest params — GA4 requires this
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", GA_ID, {
    anonymize_ip: true,
    send_page_view: false,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.onload = () => onReady?.();
  document.head.appendChild(script);
}

export function trackPageView(path: string) {
  const GA_ID = import.meta.env.VITE_GA_ID;
  if (!window.gtag || !GA_ID) return;

  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}
