import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { loadGA, trackPageView } from "@/lib/analytics";

export default function AnalyticsBoot() {
  const location = useLocation();

  useEffect(() => {
    const stored = localStorage.getItem("neoconic-cookie-consent");
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      if (parsed.analytics) {
        loadGA();
      }
    } catch {}
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("neoconic-cookie-consent");
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      if (parsed.analytics) {
        trackPageView(location.pathname + location.search);
      }
    } catch {}
  }, [location]);

  return null;
}