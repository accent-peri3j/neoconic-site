import { useEffect } from 'react';
import { getCuracaoMeta, serializeStructuredData } from '../seo/curacao-seo.mjs';

/** Completes regional SEO after the existing global hook; never runs globally. */
export function useCuracaoSEO(path: string | null) {
  useEffect(() => {
    if (!path) return;
    const metadata = getCuracaoMeta(path);
    const previousLanguage = document.documentElement.lang;
    document.documentElement.lang = metadata.language;
    document.title = metadata.title;

    for (const meta of metadata.meta) {
      const attribute = meta.name ? 'name' : 'property';
      const key = meta.name ?? meta.property;
      // The legacy hook uses property for Twitter. Keep one standard name tag.
      if (meta.name?.startsWith('twitter:')) {
        document.head.querySelectorAll(`meta[property="${meta.name}"]`).forEach(node => node.remove());
      }
      let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', meta.content);
      element.setAttribute('data-cw-seo', '');
    }

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', metadata.canonical);
    canonical.setAttribute('data-cw-seo', '');

    let schema = document.head.querySelector('script[type="application/ld+json"][data-cw-seo]');
    if (!schema) {
      schema = document.createElement('script');
      schema.setAttribute('type', 'application/ld+json');
      schema.setAttribute('data-cw-seo', '');
      document.head.appendChild(schema);
    }
    schema.textContent = serializeStructuredData(metadata.structuredData);

    return () => {
      document.documentElement.lang = previousLanguage;
      document.head.querySelectorAll('[data-cw-seo]').forEach(node => node.remove());
    };
  }, [path]);
}
