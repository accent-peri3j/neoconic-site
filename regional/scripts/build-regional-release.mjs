import { build, createServer } from 'vite';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderCuracaoHead, CW_PAGES } from '../src/app/seo/curacao-seo.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.resolve(process.argv[2] || path.join(root, 'dist-regional'));

await build({ root, base: '/cw-assets/', publicDir: false, build: { outDir, assetsDir: 'bundles', emptyOutDir: true } });
const template = await fs.readFile(path.join(outDir, 'index.html'), 'utf8');
const scripts = template.match(/<script\b[^>]*type="module"[^>]*>[\s\S]*?<\/script>/g) || [];
const styles = template.match(/<link\b[^>]*rel="stylesheet"[^>]*>/g) || [];
const server = await createServer({ root, server: { middlewareMode: true }, appType: 'custom' });
try {
  const { renderRegionalPage } = await server.ssrLoadModule('/src/entry-cw-server.tsx');
  for (const pathname of Object.keys(CW_PAGES)) {
    const body = renderRegionalPage(pathname);
    const html = `<!DOCTYPE html>\n<html lang="en-CW"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">\n${renderCuracaoHead(pathname)}\n<link rel="icon" sizes="32x32" href="/favicon-32x32.png"><link rel="icon" sizes="16x16" href="/favicon-16x16.png"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><meta name="theme-color" content="#0b0b0b">\n${styles.join('\n')}\n${scripts.join('\n')}\n<noscript><style>#main-content [style*="opacity:0"],footer [style*="opacity:0"]{opacity:1!important;transform:none!important}[data-region="curacao"] .cw-showcase-with-continue{height:100vh;height:100dvh}.cw-project-rail-position,[aria-label="Cookie preferences"]{display:none!important}.cw-showcase-viewport{position:relative}.cw-static-nav{display:flex;gap:1.5rem;flex-wrap:wrap;padding:7rem 24px 1rem;background:#0b0b0b;color:white}.cw-static-nav a{padding:.75rem 0;text-decoration:underline}</style></noscript></head><body><noscript><nav class="cw-static-nav" aria-label="Curaçao pages"><a href="/cw">Home</a><a href="/cw/work">Work</a><a href="/cw/about">About</a><a href="/cw/contact">Contact</a></nav></noscript><div id="root">${body}</div></body></html>`;
    const pageDir = path.join(outDir, 'pages', pathname.slice(1));
    await fs.mkdir(pageDir, { recursive: true });
    await fs.writeFile(path.join(pageDir, 'index.html'), html);
    if (!body.includes('data-region="curacao"')) throw new Error(`Missing regional markup: ${pathname}`);
    console.log(`Prerendered ${pathname}: ${Buffer.byteLength(html)} bytes`);
  }
} finally { await server.close(); }
