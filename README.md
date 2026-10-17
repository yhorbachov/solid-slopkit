# slopkit

A family of packages for SolidJS 2.x:

- [`@solid-slopkit/ui`](./packages/ui): components, theming and the provider.
- [`@solid-slopkit/forms`](./packages/forms): schema-driven form state over a Solid store.
- [`@solid-slopkit/i18n`](./packages/i18n): translation files next to the code that uses them.
- [`@solid-slopkit/threejs`](./packages/threejs): three.js scenes described with Solid components.

[`apps/docs`](./apps/docs) is the documentation site. [CONTEXT-MAP.md](./CONTEXT-MAP.md) explains how the packages relate, and [AGENTS.md](./AGENTS.md) is the guide for coding agents.

## Installing

The packages aren't published to npm. Every package is released together under one version, as a tarball attached to a [GitHub Release](https://github.com/yhorbachov/solid-slopkit/releases) tagged `v<version>` (ADR 0001). Install the ones you need from that release:

```bash
pnpm add https://github.com/yhorbachov/solid-slopkit/releases/download/v0.0.1/solid-slopkit-ui-0.0.1.tgz
```

## Developing

Node comes from `mise.toml` (`mise install`), and pnpm 12 runs the workspace:

```bash
pnpm install
pnpm dev            # the docs site
pnpm test           # every package's tests
pnpm lint
pnpm format:check
```

## Releasing

Every package shares one version, which [Changesets](https://github.com/changesets/changesets) sets: `.changeset/config.json` puts all `@solid-slopkit/*` packages in one `fixed` group, so a changeset for any of them moves all of them. A release is the commit that applies the changesets, plus a `v<version>` tag that starts [`.github/workflows/release.yml`](./.github/workflows/release.yml).

An agent can run the whole release with the `release` skill (`.claude/skills/release/SKILL.md`), and it asks before committing, tagging or pushing. By hand:

1. **Record changes as you go.** In the pull request that makes a change, run `pnpm changeset`, pick the packages it touches and the bump (`patch`, `minor`, `major`), and write one line for the changelog. Commit the generated `.changeset/*.md` file with the change.
2. **Apply the changesets.** On an up-to-date `main` with a clean tree:

   ```bash
   pnpm changeset version
   ```

   This sets the new version in every package, writes each package's `CHANGELOG.md` and deletes the applied changesets. Review the diff.

3. **Check it locally** (the workflow runs the same checks, so this only saves a round trip):

   ```bash
   pnpm format:check && pnpm lint && pnpm release:pack && pnpm -r --filter "./packages/*" typecheck && pnpm test
   ```

4. **Commit, tag and push.**

   ```bash
   git add -A
   git commit -m "chore: release v0.2.0"
   git tag v0.2.0
   git push origin main v0.2.0
   ```

5. **Watch the workflow.** It checks that the tag matches the packages' version and that no changesets are left unapplied, runs every check, packs every package, and creates the GitHub Release with the tarballs and each package's changelog section as notes:

   ```bash
   gh run watch "$(gh run list --workflow release.yml --limit 1 --json databaseId --jq '.[0].databaseId')"
   gh release view v0.2.0
   ```

If the workflow fails, nothing is published. Fix the cause on `main`, then move the tag to the fixed commit (`git tag -f v0.2.0 && git push -f origin v0.2.0`), or bump to a new version if the tag was already shared.
