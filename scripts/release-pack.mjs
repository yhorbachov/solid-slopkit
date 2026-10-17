// Builds every package and packs each into release/ for one GitHub Release (ADR 0001). All packages share one version,
// which Changesets sets; this refuses to pack when they don't, or when a tarball for that version already exists.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { packages, sharedVersion } from './packages.mjs';

const releaseDir = fileURLToPath(new URL('../release/', import.meta.url));
const version = sharedVersion();

// `pnpm pack` names the file after the package: @solid-slopkit/ui@1.2.3 -> solid-slopkit-ui-1.2.3.tgz.
const tarball = (name) => `${releaseDir}${name.replace('@', '').replace('/', '-')}-${version}.tgz`;
const existing = packages().filter(({ name }) => existsSync(tarball(name)));
if (existing.length) {
  console.error(`Already packed: ${existing.map(({ name }) => tarball(name)).join(', ')}.`);
  console.error('Bump the version with `pnpm changeset version` or delete the files.');
  process.exit(1);
}

mkdirSync(releaseDir, { recursive: true });
for (const { name, dir } of packages()) {
  const run = (...args) => execFileSync('pnpm', args, { cwd: dir, stdio: 'inherit' });
  run('build');
  run('pack', '--pack-destination', releaseDir);
  if (!existsSync(tarball(name))) {
    console.error(`Expected ${tarball(name)} after packing, but it is not there.`);
    process.exit(1);
  }
  console.log(`Packed ${tarball(name)}`);
}
