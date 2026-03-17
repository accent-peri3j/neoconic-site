import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * Analytics — Plausible Analytics integration (GDPR-compliant).
 *
 * This component listens for cookie consent and initializes Plausible
 * only when the user has opted in to analytics cookies.
 *
 * Setup:
 * 1. Sign up at https://plausible.io
 * 2. Add your domain
 * 3. Set VITE_PLAUSIBLE_DOMAIN in your .env file
 *
 * Plausible is privacy-friendly by default:
 * - No cookies (unless you use custom events)
 * - No personal data collected
 * - EU-hosted option available
 * - GDPR, CCPA, PECR compliant out of the box
 */

const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN || "neoconic.com";

export function Analytics() {
  const { pathname } = useLocation();

  useEffect(() => {
    function handleConsent(e: Event) {
      const detail = (e as CustomEvent).detail;
      if (detail?.analytics) {
        initPlausible();
      }
    }

    // Check if consent was already given
    try {
      const stored = localStorage.getItem("neoconic-cookie-consent");
      if (stored) {
        const consent = JSON.parse(stored);
        if (consent.analytics) {
          initPlausible();
        }
      }
    } catch {
      // Ignore parse errors
    }

    window.addEventListener("neoconic-consent", handleConsent);
    return () => window.removeEventListener("neoconic-consent", handleConsent);
  }, []);

  // Track page views on route changes
  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  return null;
}

/* ─── Plausible Analytics ─── */

let analyticsReady = false;

function initPlausible() {
  if (analyticsReady) return;

  // Don't inject in development unless explicitly enabled
  if (import.meta.env.DEV && !import.meta.env.VITE_PLAUSIBLE_DOMAIN) {
    analyticsReady = true;
    console.log("[Analytics] Plausible would initialize in production");
    return;
  }

  // Inject the Plausible script
  const existing = document.querySelector('script[data-domain]');
  if (!existing) {
    const script = document.createElement("script");
    script.defer = true;
    script.dataset.domain = PLAUSIBLE_DOMAIN;
    script.src = "https://plausible.io/js/script.js";
    document.head.appendChild(script);
  }

  analyticsReady = true;

  if (import.meta.env.DEV) {
    console.log(`[Analytics] Plausible initialized for ${PLAUSIBLE_DOMAIN}`);
  }
}

function trackPageView(path: string) {
  if (!analyticsReady) return;

  // Plausible automatically tracks page views via the script.
  // For SPA route changes, we trigger manually:
  if (typeof window !== "undefined" && (window as any).plausible) {
    (window as any).plausible("pageview", { u: `${window.location.origin}${path}` });
  }

  if (import.meta.env.DEV) {
    console.log(`[Analytics] Page view: ${path}`);
  }
}
