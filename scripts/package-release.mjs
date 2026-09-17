import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { assertFrozenBaseline, assertPublicFile, createOutputConfig, filesIn, validateRelease } from './release-lib.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const regionalBuild = path.resolve(repoRoot, process.argv[2] || '.regional-build');
const seoPath = path.resolve(repoRoot, process.argv[3] || 'regional/src/app/seo/curacao-seo.mjs');
const { CW_PAGES, renderCuracaoSitemap } = await import(pathToFileURL(seoPath));
await assertFrozenBaseline(repoRoot);

const outputParent = path.join(repoRoot, '.vercel');
const stagingDir = path.join(outputParent, 'output-staging');
const outputDir = path.join(outputParent, 'output');
await fs.mkdir(outputParent, { recursive: true });
await fs.rm(stagingDir, { recursive: true, force: true });
await fs.mkdir(stagingDir, { recursive: true });
const staticDir = path.join(stagingDir, 'static');
await fs.cp(path.join(repoRoot, 'production-static'), staticDir, { recursive: true });

const bundles = path.join(regionalBuild, 'bundles');
for (const filename of await filesIn(bundles)) {
  if (!/\.(?:js|css|png|jpe?g|webp|avif|svg|gif|ico|woff2?|ttf|otf)$/i.test(filename)) throw new Error(`Unexpected regional bundle file: ${filename}`);
  assertPublicFile(`cw-assets/bundles/${filename}`, await fs.readFile(path.join(bundles, filename)));
}
await fs.cp(bundles, path.join(staticDir, 'cw-assets/bundles'), { recursive: true });

// Explicitly copy known prerendered documents. Never publish build directories wholesale.
for (const pathname of Object.keys(CW_PAGES)) {
  const destination = path.join(staticDir, pathname.slice(1));
  await fs.mkdir(destination, { recursive: true });
  await fs.copyFile(path.join(regionalBuild, 'pages', pathname.slice(1), 'index.html'), path.join(destination, 'index.html'));
}
await fs.writeFile(path.join(staticDir, 'cw/404.html'), `<!doctype html>
<html lang="en-CW"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Page not found — Neoconic</title><meta name="robots" content="noindex, follow"><link rel="icon" href="/favicon-32x32.png"><style>body{margin:0;background:#0b0b0b;color:#fff;font:18px/1.5 system-ui,sans-serif}main{max-width:42rem;padding:clamp(32px,8vw,96px);margin:auto}h1{font-size:clamp(2.5rem,8vw,5rem);font-weight:500;line-height:1.1;letter-spacing:-.04em}a{color:inherit;display:inline-block;padding:12px 0;text-underline-offset:.3em}a:focus-visible{outline:2px solid #fff;outline-offset:5px}</style></head><body><main><p>Neoconic</p><h1>Page not found.</h1><p>The page you’re looking for isn’t here.</p><a href="/cw">Back to Neoconic Curaçao</a></main></body></html>
`);
const originalSitemap = await fs.readFile(path.join(repoRoot, 'production-static/sitemap.xml'), 'utf8');
await fs.writeFile(path.join(staticDir, 'sitemap.xml'), renderCuracaoSitemap(originalSitemap));
await fs.cp(path.join(repoRoot, 'deployment/region.func'), path.join(stagingDir, 'functions/_region.func'), { recursive: true });
const middlewareRoute = JSON.parse(await fs.readFile(path.join(repoRoot, 'deployment/middleware-route.json'), 'utf8'));
await fs.writeFile(path.join(stagingDir, 'config.json'), `${JSON.stringify(createOutputConfig(Object.keys(CW_PAGES), middlewareRoute), null, 2)}\n`);

const report = await validateRelease({ repoRoot, outputDir: stagingDir, seoPath });
await fs.rm(outputDir, { recursive: true, force: true });
await fs.rename(stagingDir, outputDir);
await fs.writeFile(path.join(outputParent, 'release-validation.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(`Packaged ${report.publicFiles} public files; ${report.preservedGlobalFiles} existing global files remain byte-identical. Regional routes: ${report.regionalPaths.join(', ')}.`);
console.log('Vercel Build Output API v3 ready at .vercel/output. Validation report: .vercel/release-validation.json');
