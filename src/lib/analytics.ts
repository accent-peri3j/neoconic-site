export function loadGA() {
  if (window.gtag) return;

  const GA_ID = import.meta.env.VITE_GA_ID;
  if (!GA_ID) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }

  window.gtag = gtag;

  gtag("js", new Date());

  gtag("config", GA_ID, {
    anonymize_ip: true,
    send_page_view: true,
    debug_mode: true,
  });
}

export function trackPageView(path: string) {
  const GA_ID = import.meta.env.VITE_GA_ID;
  if (!window.gtag || !GA_ID) return;

  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
    debug_mode: true,
  });
}

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}