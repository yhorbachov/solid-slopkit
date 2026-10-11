# Distribute as GitHub tarballs with uncompiled JSX

`@slopkit/*` packages are not published to npm. Each release is a tarball (`pnpm pack` output) attached to a GitHub Release tagged `<package>-v<version>` (e.g. `ui-v0.0.1`), and consumers install it from that release's asset URL. While the repo is private, installing needs a GitHub token in the consumer's `.npmrc` or CI. The tarball contains `.jsx` with JSX preserved, plus `.d.ts` declarations, both emitted by `tsc`. It is exposed through the `solid` export condition, so the consumer's Solid plugin compiles the components for its own targets (server, client, dev). We ship no per-target builds.

## Considered Options

- **Raw `.ts`/`.tsx` with `exports` pointing at `src`.** Rejected: `skipLibCheck` does not cover `.ts` files, so consumers would type-check the library source under their own compiler options. Stricter settings would then fail inside `@slopkit/ui`.
- **Precompiled server/client/dev builds.** Rejected: the consumer's Solid plugin already does this, and doing it here would lock the output to one Solid compiler version.
- **Tarballs committed to the repo:** rejected, because binaries would pile up in git history.
- **Git URL installs** (`github:org/slopkit#tag`): rejected, because pnpm can't install one package out of a monorepo from a git URL.
- **Publishing to npm:** deferred, not rejected.
