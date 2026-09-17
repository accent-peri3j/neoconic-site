/**
 * One source for the regional browser metadata and the published HTML.
 * Keep this dependency-free so the release builder can import it in Node.
 * English regional content is intentionally labelled en-CW, not a translation.
 */
export const SITE_URL = 'https://neoconic.com';
export const CW_OG_IMAGE = `${SITE_URL}/og-image.png`;
export const CW_LANGUAGE = 'en-CW';

export const CW_PAGES = Object.freeze({
  '/cw': {
    title: 'Branding, Marketing & Web Design in Curaçao',
    description: 'Branding, marketing campaigns, websites and motion for businesses in Curaçao. See Neoconic’s work for Better Deals and start your next project.',
    globalPath: '/',
    pageType: 'WebPage',
  },
  '/cw/work': {
    title: 'Branding & Marketing Work in Curaçao',
    description: 'Explore Neoconic’s branding, campaigns and commercial production for Better Deals in Curaçao, alongside international brand and digital design work.',
    globalPath: '/work',
    pageType: 'CollectionPage',
  },
  '/cw/about': {
    title: 'Design Studio Serving Curaçao',
    description: 'Meet Neoconic, an independent Amsterdam design studio serving Curaçao businesses with brand identity, marketing campaigns, websites and motion.',
    globalPath: '/about',
    pageType: 'AboutPage',
  },
  '/cw/contact': {
    title: 'Contact Neoconic for Your Curaçao Business',
    description: 'Planning a campaign, launching a business or refreshing your brand in Curaçao? Contact Neoconic for branding, marketing, websites and motion.',
    globalPath: '/contact',
    pageType: 'ContactPage',
  },
  '/cw/privacy-policy': {
    title: 'Privacy Policy — Curaçao',
    description: 'How Neoconic handles contact information, regional preferences and optional Google Analytics on its Curaçao website.',
    globalPath: '/privacy-policy',
    pageType: 'WebPage',
  },
});

function pageFor(path) {
  const page = CW_PAGES[path];
  if (!page) throw new Error(`Unknown regional SEO route: ${path}`);
  return page;
}

export function getCuracaoSEOProps(path) {
  const { title, description } = pageFor(path);
  return { title, description, path, ogImage: CW_OG_IMAGE };
}

export function getCuracaoStructuredData(path) {
  const page = pageFor(path);
  const organizationId = `${SITE_URL}/#organization`;
  const websiteId = `${SITE_URL}/#website`;
  const country = { '@type': 'Country', name: 'Curaçao', identifier: 'CW' };
  const graph = [
    {
      '@type': 'Organization',
      '@id': organizationId,
      name: 'Neoconic',
      url: `${SITE_URL}/`,
      email: 'hello@neoconic.com',
      logo: `${SITE_URL}/android-chrome-512x512.png`,
      description: 'Independent design studio based in Amsterdam, providing branding, marketing campaigns and digital design for Curaçao and international clients.',
      areaServed: country,
      location: {
        '@type': 'Place',
        name: 'Amsterdam studio',
        address: { '@type': 'PostalAddress', addressLocality: 'Amsterdam', addressCountry: 'NL' },
      },
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: `${SITE_URL}/`,
      name: 'Neoconic',
      publisher: { '@id': organizationId },
      inLanguage: 'en',
    },
    {
      '@type': page.pageType,
      '@id': `${SITE_URL}${path}#webpage`,
      url: `${SITE_URL}${path}`,
      name: `${page.title} — Neoconic`,
      description: page.description,
      isPartOf: { '@id': websiteId },
      about: { '@id': organizationId },
      inLanguage: CW_LANGUAGE,
      spatialCoverage: country,
      ...(path === '/cw' ? { mainEntity: { '@id': `${SITE_URL}/cw#services` } } : {}),
    },
  ];
  if (path === '/cw') {
    graph.push({
      '@type': 'Service',
      '@id': `${SITE_URL}/cw#services`,
      name: 'Branding, marketing and design for Curaçao businesses',
      serviceType: ['Brand identity', 'Marketing campaigns', 'Websites and landing pages', 'Film and motion'],
      areaServed: country,
      provider: { '@id': organizationId },
      url: `${SITE_URL}/cw#cw-services`,
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

export function getCuracaoMeta(path) {
  const { title, description } = pageFor(path);
  const documentTitle = `${title} — Neoconic`;
  return {
    title: documentTitle,
    canonical: `${SITE_URL}${path}`,
    language: CW_LANGUAGE,
    meta: [
      { name: 'description', content: description },
      { name: 'robots', content: 'index, follow, max-image-preview:large' },
      { property: 'og:title', content: documentTitle },
      { property: 'og:description', content: description },
      { property: 'og:url', content: `${SITE_URL}${path}` },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Neoconic' },
      { property: 'og:locale', content: 'en_CW' },
      { property: 'og:image', content: CW_OG_IMAGE },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: 'Neoconic logo in white on black with a red accent' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: documentTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: CW_OG_IMAGE },
      { name: 'twitter:image:alt', content: 'Neoconic logo' },
    ],
    structuredData: getCuracaoStructuredData(path),
  };
}

export function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

/** Safe inside a script element, including if content later contains HTML. */
export function serializeStructuredData(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}

/** The release builder replaces the corresponding base-head tags with this. */
export function renderCuracaoHead(path) {
  const metadata = getCuracaoMeta(path);
  return [
    `<title>${escapeHTML(metadata.title)}</title>`,
    ...metadata.meta.map(meta => `<meta ${meta.name ? 'name' : 'property'}="${escapeHTML(meta.name ?? meta.property)}" content="${escapeHTML(meta.content)}" data-cw-seo="">`),
    `<link rel="canonical" href="${escapeHTML(metadata.canonical)}" data-cw-seo="">`,
    `<script type="application/ld+json" data-cw-seo="">${serializeStructuredData(metadata.structuredData)}</script>`,
  ].join('\n');
}

/**
 * Sitemap hreflang is reciprocal, so the global HTML can stay byte-for-byte
 * unchanged. Preserve every existing URL and its optional sitemap fields.
 */
export function renderCuracaoSitemap(existingSitemap) {
  if (!/<urlset\b/.test(existingSitemap)) throw new Error('Expected an existing urlset sitemap');
  const entries = [...existingSitemap.matchAll(/<url>\s*([\s\S]*?)\s*<\/url>/g)].map(match => ({
    content: match[1],
    url: match[1].match(/<loc>\s*([^<]+)\s*<\/loc>/)?.[1].trim(),
  }));
  for (const [path, page] of Object.entries(CW_PAGES)) {
    const globalUrl = `${SITE_URL}${page.globalPath}`;
    const regionalUrl = `${SITE_URL}${path}`;
    if (!entries.some(entry => entry.url === globalUrl)) throw new Error(`Missing global counterpart in sitemap: ${globalUrl}`);
    if (!entries.some(entry => entry.url === regionalUrl)) entries.push({ url: regionalUrl, content: `<loc>${regionalUrl}</loc>` });
    const alternates = [
      ['en', globalUrl],
      ['en-CW', regionalUrl],
      ['x-default', globalUrl],
    ].map(([language, url]) => `<xhtml:link rel="alternate" hreflang="${language}" href="${escapeHTML(url)}" />`).join('\n    ');
    for (const entry of entries.filter(entry => entry.url === globalUrl || entry.url === regionalUrl)) {
      const original = entry.content.replace(/\s*<xhtml:link\b[^>]*\/?\s*>/g, '');
      entry.content = `${original}\n    ${alternates}`;
    }
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.map(entry => `  <url>\n    ${entry.content}\n  </url>`).join('\n')}\n</urlset>\n`;
}
