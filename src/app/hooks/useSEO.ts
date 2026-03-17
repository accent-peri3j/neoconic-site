import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
}

const SITE_NAME = "Neoconic";
const BASE_URL = "https://neoconic.com";

/**
 * Lightweight SEO hook — sets document title and meta tags.
 * For SSR/prerendering, consider migrating to react-helmet-async.
 */
export function useSEO({ title, description, path = "", ogImage }: SEOProps) {
  useEffect(() => {
    // Page title
    document.title = title === "Home"
      ? `${SITE_NAME} — Design Studio for Fintech & Technology`
      : `${title} — ${SITE_NAME}`;

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);

    // Open Graph
    setMeta("og:title", document.title);
    setMeta("og:description", description);
    setMeta("og:url", `${BASE_URL}${path}`);
    setMeta("og:type", "website");
    setMeta("og:site_name", SITE_NAME);

    // OG Image
    if (ogImage) {
      setMeta("og:image", ogImage);
      setMeta("og:image:width", "1200");
      setMeta("og:image:height", "630");
    }

    // Twitter Card
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", document.title);
    setMeta("twitter:description", description);
    if (ogImage) {
      setMeta("twitter:image", ogImage);
    }

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `${BASE_URL}${path}`);
  }, [title, description, path, ogImage]);
}

function setMeta(property: string, content: string) {
  const isOg = property.startsWith("og:") || property.startsWith("twitter:");
  const selector = isOg
    ? `meta[property="${property}"]`
    : `meta[name="${property}"]`;
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(isOg ? "property" : "name", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}