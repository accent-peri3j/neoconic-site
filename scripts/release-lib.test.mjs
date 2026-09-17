import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { assertPublicFile, createOutputConfig, fileHashes, validateRelease } from './release-lib.mjs';

const middlewareRoute = { src: '^/$', methods: ['GET', 'HEAD'], middlewareRawSrc: ['/'], middlewarePath: '_region', continue: true };
const regionalPaths = ['/cw', '/cw/work', '/cw/about', '/cw/contact', '/cw/privacy-policy'];
const config = createOutputConfig(regionalPaths, middlewareRoute);
function terminalRoute(pathname) {
  return config.routes.find(route => route.src && new RegExp(route.src).test(pathname) && !route.continue);
}

test('every known regional URL has a dedicated static document and canonical variants terminate', () => {
  for (const pathname of regionalPaths) {
    assert.equal(terminalRoute(pathname).dest, `${pathname}/index.html`);
    for (const variant of [`${pathname}/`, `${pathname}/index.html`]) {
      const rule = terminalRoute(variant);
      assert.equal(rule.status, 308);
      assert.equal(rule.headers.Location, pathname);
      assert.equal(terminalRoute(rule.headers.Location).status, undefined);
    }
  }
});

test('unknown regional paths return 404/noindex, while all original SPA exclusions remain', () => {
  for (const pathname of ['/cw/missing', '/cw/work/missing', '/cw/private.env']) {
    const route = terminalRoute(pathname);
    assert.equal(route.status, 404);
    assert.equal(route.dest, '/cw/404.html');
    assert.equal(route.headers['X-Robots-Tag'], 'noindex, follow');
  }
  for (const pathname of ['/', '/work', '/about', '/contact', '/privacy-policy', '/terms', '/disclaimer', '/existing-fallback', '/_region']) {
    assert.equal(terminalRoute(pathname).dest, '/index.html');
  }
  for (const pathname of ['/assets/app.js', '/images/project.jpg', '/robots.txt', '/sitemap.xml', '/missing.ext']) assert.equal(terminalRoute(pathname), undefined);
});

test('direct middleware URL is intercepted before filesystem while root middleware remains configured', () => {
  const functionGuardIndex = config.routes.findIndex(route => route.src === '^/_region$');
  const filesystemIndex = config.routes.findIndex(route => route.handle === 'filesystem');
  assert(functionGuardIndex > 0 && functionGuardIndex < filesystemIndex);
  assert.equal(config.routes[functionGuardIndex].dest, '/index.html');
  assert.deepEqual(config.routes[0], middlewareRoute);
});

test('security headers are scoped to regional pages; the original global asset cache rules remain', () => {
  const securityRule = config.routes.find(route => route.headers?.['Content-Security-Policy']);
  assert.equal(securityRule.headers['Content-Security-Policy'], "frame-ancestors 'self'");
  assert.equal(securityRule.headers['X-Content-Type-Options'], 'nosniff');
  assert.equal(securityRule.headers['Referrer-Policy'], 'strict-origin-when-cross-origin');
  for (const pathname of regionalPaths) assert(new RegExp(securityRule.src).test(pathname));
  for (const pathname of ['/', '/work', '/images/test.jpg', '/cw-other']) assert(!new RegExp(securityRule.src).test(pathname));
  for (const pathname of ['/images/project.jpg', '/assets/app.js', '/other.js', '/other.css']) assert(config.routes.some(route => new RegExp(route.src || '$^').test(pathname) && route.headers?.['Cache-Control'] === 'public, max-age=31536000, immutable'));
});

test('source/private paths, sourcemaps and recognizable credentials are rejected', () => {
  for (const filename of ['.env', 'nested/.env.local', 'scripts/release.js', 'src/index.tsx', 'node_modules/package.js', 'backups/archive.zip', 'assets/app.js.map', 'secret.pem']) assert.throws(() => assertPublicFile(filename, 'example'));
  assert.throws(() => assertPublicFile('assets/app.js', '-----BEGIN PRIVATE KEY-----'));
  assert.throws(() => assertPublicFile('assets/app.js', `const secret="ghp_${'a'.repeat(40)}"`));
  assert.doesNotThrow(() => assertPublicFile('cw-assets/bundles/index-ab1234.js', 'const measurementId="G-PUBLIC123";'));
  assert.throws(() => createOutputConfig(['/cw/../../private'], middlewareRoute));
});

async function withFixture(callback) {
  const repoRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'neoconic-release-check-'));
  const outputDir = path.join(repoRoot, '.vercel/output');
  const baseline = path.join(repoRoot, 'production-static');
  const seoPath = path.join(repoRoot, 'seo.mjs');
  try {
    await fs.mkdir(baseline, { recursive: true });
    await fs.mkdir(path.join(repoRoot, 'deployment/region.func'), { recursive: true });
    await fs.writeFile(path.join(baseline, 'index.html'), '<!doctype html><title>Original Neoconic</title>');
    const sitemap = '<urlset><url><loc>https://neoconic.com/</loc><priority>1.0</priority></url></urlset>';
    await fs.writeFile(path.join(baseline, 'sitemap.xml'), sitemap);
    const manifest = { deployment: 'fixture.vercel.app', commit: 'fixture', files: await fileHashes(baseline) };
    await fs.writeFile(path.join(repoRoot, 'deployment/global-baseline-manifest.json'), JSON.stringify(manifest));
    await fs.writeFile(path.join(repoRoot, 'deployment/middleware-route.json'), JSON.stringify(middlewareRoute));
    await fs.writeFile(path.join(repoRoot, 'deployment/region.func/index.js'), 'export default () => new Response();');
    await fs.writeFile(seoPath, 'export const CW_PAGES = {"/cw":{}}; export const SITE_URL="https://neoconic.com";');
    await fs.cp(baseline, path.join(outputDir, 'static'), { recursive: true });
    await fs.mkdir(path.join(outputDir, 'static/cw'), { recursive: true });
    await fs.mkdir(path.join(outputDir, 'static/cw-assets/bundles'), { recursive: true });
    await fs.writeFile(path.join(outputDir, 'static/cw-assets/bundles/index-123.js'), 'console.log("public");');
    await fs.writeFile(path.join(outputDir, 'static/cw-assets/bundles/index-123.css'), 'body{color:white}');
    await fs.writeFile(path.join(outputDir, 'static/cw/index.html'), '<html lang="en-CW"><link rel="canonical" href="https://neoconic.com/cw"><link href="/cw-assets/bundles/index-123.css"><script src="/cw-assets/bundles/index-123.js"></script><main data-region="curacao">Regional page</main></html>');
    await fs.writeFile(path.join(outputDir, 'static/cw/404.html'), '<meta name="robots" content="noindex, follow">');
    await fs.writeFile(path.join(outputDir, 'static/sitemap.xml'), sitemap.replace('</urlset>', '<url><loc>https://neoconic.com/cw</loc></url></urlset>'));
    await fs.writeFile(path.join(outputDir, 'config.json'), JSON.stringify(createOutputConfig(['/cw'], middlewareRoute)));
    await fs.cp(path.join(repoRoot, 'deployment/region.func'), path.join(outputDir, 'functions/_region.func'), { recursive: true });
    await callback({ repoRoot, outputDir, seoPath });
  } finally { await fs.rm(repoRoot, { recursive: true, force: true }); }
}

test('complete package validation succeeds for byte-preserved global files and scoped additions', () => withFixture(async options => {
  const report = await validateRelease(options);
  assert.equal(report.preservedGlobalFiles, 1);
  assert.equal(report.publicFiles, 6);
}));

test('validation rejects changed global HTML or an unexpected public private file', () => withFixture(async options => {
  const globalFile = path.join(options.outputDir, 'static/index.html');
  const original = await fs.readFile(globalFile);
  await fs.writeFile(globalFile, 'changed');
  await assert.rejects(validateRelease(options), /Global production bytes changed/);
  await fs.writeFile(globalFile, original);
  await fs.writeFile(path.join(options.outputDir, 'static/.env'), 'credential=example');
  await assert.rejects(validateRelease(options), /Unexpected public file/);
}));

test('validation rejects a mutated frozen baseline before packaging can proceed', () => withFixture(async options => {
  await fs.writeFile(path.join(options.repoRoot, 'production-static/index.html'), 'baseline changed');
  await assert.rejects(validateRelease(options), /Frozen production files must match/);
}));

test('validation rejects an accidental noindex and missing regional assets', () => withFixture(async options => {
  const pageFile = path.join(options.outputDir, 'static/cw/index.html');
  const page = await fs.readFile(pageFile, 'utf8');
  await fs.writeFile(pageFile, `${page}<meta name="robots" content="noindex">`);
  await assert.rejects(validateRelease(options), /Regional page is noindex/);
  await fs.writeFile(pageFile, page.replace('index-123.js', 'missing.js'));
  await assert.rejects(validateRelease(options), /Missing regional asset/);
}));

test('validation rejects changes to existing sitemap fields', () => withFixture(async options => {
  const sitemapFile = path.join(options.outputDir, 'static/sitemap.xml');
  const sitemap = await fs.readFile(sitemapFile, 'utf8');
  await fs.writeFile(sitemapFile, sitemap.replace('<priority>1.0</priority>', '<priority>0.1</priority>'));
  await assert.rejects(validateRelease(options), /Existing sitemap fields changed/);
}));

test('validation rejects unreviewed middleware changes', () => withFixture(async options => {
  await fs.writeFile(path.join(options.outputDir, 'functions/_region.func/index.js'), 'export default () => new Response("changed");');
  await assert.rejects(validateRelease(options), /Middleware source differs/);
}));
