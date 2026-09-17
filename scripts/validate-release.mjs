import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateRelease } from './release-lib.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.resolve(repoRoot, process.argv[2] || '.vercel/output');
const seoPath = path.resolve(repoRoot, process.argv[3] || 'regional/src/app/seo/curacao-seo.mjs');
const report = await validateRelease({ repoRoot, outputDir, seoPath });
await fs.writeFile(path.join(repoRoot, '.vercel/release-validation.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ preservedGlobalFiles: report.preservedGlobalFiles, regionalPaths: report.regionalPaths, publicFiles: report.publicFiles, checks: report.checks }, null, 2));
