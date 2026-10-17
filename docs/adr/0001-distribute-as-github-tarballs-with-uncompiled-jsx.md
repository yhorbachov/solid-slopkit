# Distribute as GitHub tarballs with uncompiled JSX

`@solid-slopkit/*` packages are not published to npm. Every package is released together under one version: a GitHub Release tagged `v<version>` (e.g. `v0.2.0`) carries one tarball (`pnpm pack` output) per package, and consumers install the ones they want from that release's asset URLs. Changesets keeps the versions in step (a `fixed` group in `.changeset/config.json`) and writes each package's changelog; `pnpm release:pack` packs the tarballs. While the repo is private, installing needs a GitHub token in the consumer's `.npmrc` or CI. The tarball contains `.jsx` with JSX preserved, plus `.d.ts` declarations, both emitted by `tsc`. It is exposed through the `solid` export condition, so the consumer's Solid plugin compiles the components for its own targets (server, client, dev). We ship no per-target builds.

## Considered Options

- **Raw `.ts`/`.tsx` with `exports` pointing at `src`.** Rejected: `skipLibCheck` does not cover `.ts` files, so consumers would type-check the library source under their own compiler options. Stricter settings would then fail inside `@solid-slopkit/ui`.
- **Precompiled server/client/dev builds.** Rejected: the consumer's Solid plugin already does this, and doing it here would lock the output to one Solid compiler version.
- **Tarballs committed to the repo:** rejected, because binaries would pile up in git history.
- **Git URL installs** (`github:org/slopkit#tag`): rejected, because pnpm can't install one package out of a monorepo from a git URL.
- **A release per package** (`ui-v0.0.1`, `forms-v0.0.1`, …): replaced. Every package needed its own workflow and version, and a consumer using several packages had to work out which versions go together. With one version, any packages from the same release work together.
- **`changeset pack` and `changeset publish`:** not used. Both decide what to release by asking the npm registry, where these packages don't live.
- **Publishing to npm:** deferred, not rejected.
