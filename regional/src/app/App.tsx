import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { hasAnalyticsConsent, loadGA, setRegionalAnalyticsConsent, trackPageView } from "@/lib/analytics";
import { isCwPath } from "./data/curacao";

const STORAGE_KEY = "neoconic-cookie-consent";

export default function App() {
  useEffect(() => {
    if (isCwPath(router.state.location.pathname)) {
      setRegionalAnalyticsConsent(hasAnalyticsConsent());
      const updateConsent = (event: Event) => {
        setRegionalAnalyticsConsent((event as CustomEvent).detail?.analytics === true);
      };
      const syncConsent = (event: StorageEvent) => {
        if (event.key === STORAGE_KEY || event.key === null) {
          setRegionalAnalyticsConsent(hasAnalyticsConsent());
        }
      };
      window.addEventListener("neoconic-consent", updateConsent);
      window.addEventListener("storage", syncConsent);
      // Existing GA Enhanced Measurement handles browser-history page changes.
      // Adding a router page_view here would count those navigations twice.
      return () => {
        window.removeEventListener("neoconic-consent", updateConsent);
        window.removeEventListener("storage", syncConsent);
      };
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.analytics) {
          loadGA(() => {
            trackPageView(
              router.state.location.pathname + router.state.location.search
            );
          });
        }
      } catch {}
    }

    const handleConsent = (e: Event) => {
      const consent = (e as CustomEvent).detail;
      if (consent.analytics) {
        loadGA(() => {
          trackPageView(
            router.state.location.pathname + router.state.location.search
          );
        });
      }
    };

    window.addEventListener("neoconic-consent", handleConsent);

    const unsubscribe = router.subscribe((state) => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      try {
        const parsed = JSON.parse(stored);
        if (parsed.analytics) {
          trackPageView(state.location.pathname + state.location.search);
        }
      } catch {}
    });

    return () => {
      unsubscribe();
      window.removeEventListener("neoconic-consent", handleConsent);
    };
  }, []);

  return <RouterProvider router={router} />;
}
