import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { readdirSync } from 'node:fs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
execFileSync(process.execPath, ['scripts/build-regional-release.mjs', path.join(root, '.regional-build')], {
  cwd: path.join(root, 'regional'), stdio: 'inherit',
});
execFileSync(process.execPath, ['scripts/package-release.mjs'], { cwd: root, stdio: 'inherit' });

const tests = ['regional/tests', 'scripts', 'deployment'].flatMap(directory =>
  readdirSync(path.join(root, directory)).filter(name => name.endsWith('.test.mjs')).map(name => path.join(root, directory, name))
);
execFileSync(process.execPath, ['--test', ...tests], { cwd: root, stdio: 'inherit' });
