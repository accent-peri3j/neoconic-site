export function loadGA(onReady?: () => void) {
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