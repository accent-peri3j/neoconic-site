import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  CW_PAGES, SITE_URL, getCuracaoMeta, getCuracaoSEOProps,
  renderCuracaoHead, renderCuracaoSitemap, serializeStructuredData,
} from '../src/app/seo/curacao-seo.mjs';

test('the regional routes have consistent browser and initial-HTML metadata', () => {
  assert.deepEqual(Object.keys(CW_PAGES), ['/cw', '/cw/work', '/cw/about', '/cw/contact', '/cw/privacy-policy']);
  const titles = new Set();
  for (const path of Object.keys(CW_PAGES)) {
    const metadata = getCuracaoMeta(path);
    const props = getCuracaoSEOProps(path);
    const head = renderCuracaoHead(path);
    assert.equal(metadata.title, `${props.title} — Neoconic`);
    assert.equal(metadata.canonical, `${SITE_URL}${path}`);
    assert.equal(metadata.language, 'en-CW');
    assert.match(metadata.title, /Curaçao/);
    assert.ok(metadata.title.length <= 65);
    assert.ok(props.description.length <= 160);
    assert.equal(metadata.meta.filter(meta => meta.name === 'description')[0].content, props.description);
    assert.equal((head.match(/rel="canonical"/g) || []).length, 1);
    assert.equal((head.match(/<title>/g) || []).length, 1);
    assert.equal((head.match(/name="twitter:title"/g) || []).length, 1);
    assert.doesNotMatch(head, /property="twitter:/);
    assert.doesNotMatch(head, /noindex|localhost|127\.0\.0\.1|trycloudflare/);
    assert.deepEqual(JSON.parse(head.match(/<script[^>]*>(.*?)<\/script>/s)[1]), metadata.structuredData);
    titles.add(metadata.title);
  }
  assert.equal(titles.size, Object.keys(CW_PAGES).length);
});

test('structured data distinguishes the service area from the actual Amsterdam studio', () => {
  for (const path of Object.keys(CW_PAGES)) {
    const graph = getCuracaoMeta(path).structuredData['@graph'];
    const organization = graph.find(node => node['@type'] === 'Organization');
    assert.equal(organization.areaServed.identifier, 'CW');
    assert.equal(organization.location.address.addressCountry, 'NL');
    assert.equal(organization.location.address.addressLocality, 'Amsterdam');
    assert.ok(!('streetAddress' in organization.location.address));
    assert.ok(!graph.some(node => node['@type'] === 'LocalBusiness' || 'aggregateRating' in node));
    assert.equal(graph.filter(node => node['@type'] === 'Service').length, path === '/cw' ? 1 : 0);
  }
});

test('regional sitemap preserves existing URLs and publishes complete reciprocal alternatives', () => {
  const source = readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
  const result = renderCuracaoSitemap(source);
  const originalUrls = [...source.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  const resultUrls = [...result.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  const expectedUrls = new Set([...originalUrls, ...Object.keys(CW_PAGES).map(path => `${SITE_URL}${path}`)]);
  assert.deepEqual(new Set(resultUrls), expectedUrls);
  for (const url of originalUrls) assert.ok(resultUrls.includes(url));
  assert.match(result, /xmlns:xhtml="http:\/\/www.w3.org\/1999\/xhtml"/);
  const entries = [...result.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(match => match[1]);
  for (const [path, page] of Object.entries(CW_PAGES)) {
    const pair = [`${SITE_URL}${path}`, `${SITE_URL}${page.globalPath}`];
    for (const url of pair) {
      const entry = entries.find(value => value.includes(`<loc>${url}</loc>`));
      const alternates = [...entry.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)].map(match => [match[1], match[2]]);
      assert.deepEqual(alternates, [['en', pair[1]], ['en-CW', pair[0]], ['x-default', pair[1]]]);
    }
  }
  assert.equal((renderCuracaoSitemap(result).match(/<xhtml:link/g) || []).length, Object.keys(CW_PAGES).length * 6);
  assert.throws(() => renderCuracaoSitemap(source.replace('<loc>https://neoconic.com/about</loc>', '<loc>https://neoconic.com/missing</loc>')), /Missing global counterpart/);
});

test('head generation rejects unknown routes and cannot close a JSON-LD script', () => {
  assert.throws(() => renderCuracaoHead('/cw/missing'), /Unknown regional SEO route/);
  const unsafe = { text: '</script><script>alert(1)</script>\u2028\u2029' };
  const serialized = serializeStructuredData(unsafe);
  assert.ok(!serialized.includes('<'));
  assert.deepEqual(JSON.parse(serialized), unsafe);
});
