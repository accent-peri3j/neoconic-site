let gaLoaded = false;

export function loadGA() {
  if (gaLoaded) return;

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
  });

  gaLoaded = true;
}

export function trackPageView(path: string) {
  const GA_ID = import.meta.env.VITE_GA_ID;
  if (!window.gtag || !GA_ID) return;

  window.gtag("config", GA_ID, {
    page_path: path,
  });
}

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}