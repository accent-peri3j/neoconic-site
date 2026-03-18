import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { loadGA, trackPageView } from "@/lib/analytics";

const STORAGE_KEY = "neoconic-cookie-consent";

export default function App() {
  useEffect(() => {
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