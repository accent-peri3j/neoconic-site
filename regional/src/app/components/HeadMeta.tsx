import { useEffect } from "react";

/**
 * Static paths for meta assets served from /public.
 *
 * Place the following files in your /public directory:
 *   /favicon-16x16.png
 *   /favicon-32x32.png
 *   /apple-touch-icon.png
 *   /android-chrome-192x192.png
 *   /android-chrome-512x512.png
 *   /og-image.png
 *   /site.webmanifest
 */

/** OG image path — used by pages via useSEO */
export const OG_IMAGE_URL = "https://neoconic.com/og-image.png";

/**
 * HeadMeta — Injects favicons, app icons, theme color, and manifest link
 * into the document <head> at runtime.
 *
 * Mount once in the Layout component.
 */
export function HeadMeta() {
  useEffect(() => {
    // ── Favicon 16×16 ──
    setLink("icon-16", {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16x16.png",
    });

    // ── Favicon 32×32 ──
    setLink("icon-32", {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png",
    });

    // ── Apple Touch Icon ──
    setLink("apple-touch", {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png",
    });

    // ── Theme color ──
    setMeta("theme-color", "theme-color", "#000000");

    // ── Web App Manifest ──
    setLink("manifest", { rel: "manifest", href: "/site.webmanifest" });
  }, []);

  return null;
}

/* ─── Helpers ─── */

function setLink(id: string, attrs: Record<string, string>) {
  const dataAttr = `data-head-meta-${id}`;
  let el = document.querySelector(
    `link[${dataAttr}]`
  ) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute(dataAttr, "");
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([key, value]) => {
    el!.setAttribute(key, value);
  });
}

function setMeta(id: string, name: string, content: string) {
  const dataAttr = `data-head-meta-${id}`;
  let el = document.querySelector(
    `meta[${dataAttr}]`
  ) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(dataAttr, "");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}
