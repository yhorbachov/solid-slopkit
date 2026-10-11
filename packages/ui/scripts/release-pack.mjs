// Builds the package and packs it into <repo>/release/ for a GitHub Release (ADR 0001).
// Refuses to overwrite a tarball that already exists for this version.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const packageDir = fileURLToPath(new URL('..', import.meta.url));
const releaseDir = fileURLToPath(new URL('../../../release/', import.meta.url));
const { name, version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

// `pnpm pack` names the file after the package: @slopkit/ui@1.2.3 -> slopkit-ui-1.2.3.tgz.
const tarball = `${releaseDir}${name.replace('@', '').replace('/', '-')}-${version}.tgz`;
if (existsSync(tarball)) {
  console.error(`${tarball} already exists. Bump the version in package.json or delete the file.`);
  process.exit(1);
}

const run = (...args) => execFileSync('pnpm', args, { cwd: packageDir, stdio: 'inherit' });
run('build');
mkdirSync(releaseDir, { recursive: true });
run('pack', '--pack-destination', releaseDir);

if (!existsSync(tarball)) {
  console.error(`Expected ${tarball} after packing, but it is not there.`);
  process.exit(1);
}
console.log(`Packed ${tarball}`);
