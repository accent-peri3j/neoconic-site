import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';

export const sha256 = value => createHash('sha256').update(value).digest('hex');
export const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export async function filesIn(directory, prefix = '') {
  const files = [];
  for (const entry of (await fs.readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isSymbolicLink()) throw new Error(`Symlinks are not allowed in a release: ${relative}`);
    if (entry.isDirectory()) files.push(...await filesIn(path.join(directory, entry.name), relative));
    else if (entry.isFile()) files.push(relative);
    else throw new Error(`Unsupported release entry: ${relative}`);
  }
  return files;
}

export async function fileHashes(directory) {
  const result = {};
  for (const filename of await filesIn(directory)) result[`/${filename}`] = sha256(await fs.readFile(path.join(directory, filename)));
  return result;
}

export async function assertFrozenBaseline(repoRoot) {
  const manifest = JSON.parse(await fs.readFile(path.join(repoRoot, 'deployment/global-baseline-manifest.json'), 'utf8'));
  const actual = await fileHashes(path.join(repoRoot, 'production-static'));
  assert.deepEqual(actual, manifest.files, 'Frozen production files must match the captured production SHA-256 manifest exactly');
  return manifest;
}

export const CW_SECURITY_HEADERS = Object.freeze({
  'X-Content-Type-Options': 'nosniff',
  'Content-Security-Policy': "frame-ancestors 'self'",
  'Referrer-Policy': 'strict-origin-when-cross-origin',
});
const IMMUTABLE_HEADERS = { 'Cache-Control': 'public, max-age=31536000, immutable' };
const PRIVATE_HEADERS = { 'Cache-Control': 'private, no-store', 'CDN-Cache-Control': 'no-store', 'Vercel-CDN-Cache-Control': 'no-store' };

export function createOutputConfig(regionalPaths, middlewareRoute) {
  for (const pathname of regionalPaths) assert.match(pathname, /^\/cw(?:\/[a-z0-9-]+)*$/, `Unexpected regional path ${pathname}`);
  return {
    version: 3,
    routes: [
      // Request-specific selection must run before files or the existing SPA fallback.
      middlewareRoute,
      { src: '^/$', headers: PRIVATE_HEADERS, continue: true },
      { src: '^/cw(?:/.*)?$', headers: CW_SECURITY_HEADERS, continue: true },
      // The four original global asset cache rules are retained.
      { src: '^/images/(.*)$', headers: IMMUTABLE_HEADERS, continue: true },
      { src: '^/assets/(.*)$', headers: IMMUTABLE_HEADERS, continue: true },
      { src: '^/(.*)\\.js$', headers: IMMUTABLE_HEADERS, continue: true },
      { src: '^/(.*)\\.css$', headers: IMMUTABLE_HEADERS, continue: true },
      { src: '^/cw-assets/(.*)$', headers: { ...IMMUTABLE_HEADERS, 'X-Content-Type-Options': 'nosniff' }, continue: true },
      ...regionalPaths.map(pathname => ({
        src: `^${escapeRegex(pathname)}(?:/|/index\\.html)$`,
        headers: { Location: pathname }, status: 308,
      })),
      ...regionalPaths.map(pathname => ({ src: `^${escapeRegex(pathname)}$`, dest: `${pathname}/index.html` })),
      // Unknown regional URLs must never fall through into the global SPA with a 200.
      { src: '^/cw(?:/.*)?$', dest: '/cw/404.html', status: 404, headers: { 'X-Robots-Tag': 'noindex, follow', 'Cache-Control': 'no-store' } },
      // Only root middleware invocation may reach this internal function; preserve
      // the former global SPA response to a direct /_region URL.
      { src: '^/_region$', dest: '/index.html' },
      { handle: 'filesystem' },
      // Identical path exclusion / destination to the captured production vercel.json.
      { src: '^/((?!assets|images|.*\\..*$).*)$', dest: '/index.html' },
    ],
  };
}

export function assertPublicFile(filename, content) {
  assert(!filename.split('/').some(segment => segment.startsWith('.')), `Hidden file would be published: ${filename}`);
  assert(!/(^|\/)(?:node_modules|production-static|deployment|scripts|src|tests?|backups?)(\/|$)/i.test(filename), `Private source would be published: ${filename}`);
  assert(!/\.(?:map|ts|tsx|mjs|pem|key|p12|pfx|zip|tar|gz|log|md|toml|lock)$/i.test(filename), `Private or source file would be published: ${filename}`);
  const text = Buffer.isBuffer(content) ? content.toString('utf8') : String(content);
  for (const pattern of [
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    /\bAKIA[0-9A-Z]{16}\b/,
    /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{30,}\b/,
    /\bgithub_pat_[A-Za-z0-9_]{50,}\b/,
    /\bsk_(?:live|test)_[A-Za-z0-9]{20,}\b/,
  ]) assert(!pattern.test(text), `Possible credential in public file: ${filename}`);
}

function sitemapEntries(xml) {
  return [...xml.matchAll(/<url>\s*([\s\S]*?)\s*<\/url>/g)].map(match => ({
    url: match[1].match(/<loc>\s*([^<]+)\s*<\/loc>/)?.[1].trim(),
    originalFields: match[1].replace(/\s*<xhtml:link\b[^>]*\/?\s*>/g, '').replace(/\s+/g, ' ').trim(),
  }));
}

/** Validates real staged output before it can replace .vercel/output. */
export async function validateRelease({ repoRoot, outputDir, seoPath = path.join(repoRoot, 'regional/src/app/seo/curacao-seo.mjs') }) {
  const manifest = await assertFrozenBaseline(repoRoot);
  const { CW_PAGES, SITE_URL } = await import(pathToFileURL(seoPath));
  const regionalPaths = Object.keys(CW_PAGES);
  const staticDir = path.join(outputDir, 'static');
  const hashes = await fileHashes(staticDir);
  const preserved = Object.keys(manifest.files).filter(filename => filename !== '/sitemap.xml');
  for (const filename of preserved) assert.equal(hashes[filename], manifest.files[filename], `Global production bytes changed: ${filename}`);
  const bundleFiles = Object.keys(hashes).filter(filename => filename.startsWith('/cw-assets/bundles/'));
  assert(bundleFiles.some(filename => filename.endsWith('.js')), 'Regional JavaScript bundle missing');
  assert(bundleFiles.some(filename => filename.endsWith('.css')), 'Regional CSS bundle missing');
  const allowed = new Set([...Object.keys(manifest.files), ...regionalPaths.map(pathname => `${pathname}/index.html`), '/cw/404.html', ...bundleFiles]);
  for (const filename of Object.keys(hashes)) {
    assert(allowed.has(filename), `Unexpected public file: ${filename}`);
    assertPublicFile(filename.slice(1), await fs.readFile(path.join(staticDir, filename.slice(1))));
  }
  for (const pathname of regionalPaths) {
    const html = await fs.readFile(path.join(staticDir, pathname.slice(1), 'index.html'), 'utf8');
    assert(html.includes(`href="${SITE_URL}${pathname}"`), `Missing regional canonical: ${pathname}`);
    assert(html.includes('lang="en-CW"'), `Missing regional language: ${pathname}`);
    assert(html.includes('data-region="curacao"'), `Missing prerendered regional content: ${pathname}`);
    assert(!/<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html), `Regional page is noindex: ${pathname}`);
    const references = [...html.matchAll(/(?:src|href)="(\/cw-assets\/[^"?#]+)[^\"]*"/g)].map(match => match[1]);
    assert(references.length >= 2, `Regional bundle references missing: ${pathname}`);
    for (const asset of references) assert(hashes[asset], `Missing regional asset ${asset}`);
  }
  const originalSitemap = await fs.readFile(path.join(repoRoot, 'production-static/sitemap.xml'), 'utf8');
  const sitemap = await fs.readFile(path.join(staticDir, 'sitemap.xml'), 'utf8');
  const entries = sitemapEntries(sitemap);
  assert.equal(new Set(entries.map(entry => entry.url)).size, entries.length, 'Duplicate sitemap URL');
  for (const entry of sitemapEntries(originalSitemap)) assert.deepEqual(entries.find(item => item.url === entry.url), entry, `Existing sitemap fields changed for ${entry.url}`);
  for (const pathname of regionalPaths) assert(entries.some(entry => entry.url === `${SITE_URL}${pathname}`), `Missing regional sitemap URL ${pathname}`);
  const middlewareRoute = JSON.parse(await fs.readFile(path.join(repoRoot, 'deployment/middleware-route.json'), 'utf8'));
  const config = JSON.parse(await fs.readFile(path.join(outputDir, 'config.json'), 'utf8'));
  assert.deepEqual(config, createOutputConfig(regionalPaths, middlewareRoute), 'Unexpected routing configuration');
  assert.deepEqual(await fileHashes(path.join(outputDir, 'functions/_region.func')), await fileHashes(path.join(repoRoot, 'deployment/region.func')), 'Middleware source differs from reviewed artifact');
  const notFound = await fs.readFile(path.join(staticDir, 'cw/404.html'), 'utf8');
  assert.match(notFound, /name="robots" content="noindex, follow"/);
  return {
    globalDeployment: manifest.deployment,
    globalCommit: manifest.commit,
    preservedGlobalFiles: preserved.length,
    globalChangeExceptions: ['sitemap.xml: original URLs/fields preserved; regional URLs and reciprocal hreflang appended'],
    regionalPaths,
    publicFiles: Object.keys(hashes).length,
    bundleFiles,
    checks: ['frozen baseline SHA-256', 'global output SHA-256', 'public file allowlist and credential patterns', 'regional static HTML and asset references', 'sitemap original fields and regional entries', 'exact route config', 'reviewed middleware bytes', '404 noindex'],
    staticSHA256: hashes,
  };
}
