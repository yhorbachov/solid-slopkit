---
name: release
description: Release every @solid-slopkit package under a new version - apply changesets, run the checks, commit, tag v<version>, push, and watch the release workflow. Use when the user asks to release, cut a release, publish, ship a version, or bump the version.
---

# Releasing slopkit

Every package (`ui`, `forms`, `i18n`, `threejs`) is released together under one version, as tarballs on one GitHub Release tagged `v<version>` (ADR 0001). Changesets sets the version: `.changeset/config.json` puts every `@solid-slopkit/*` package in one `fixed` group, so any changeset moves all of them. Pushing the tag starts `.github/workflows/release.yml`, which runs every check, packs, and publishes the release. The README's "Releasing" section is the human version of these steps.

Committing, tagging and pushing are the user's calls. Stop and ask before each one, show what will happen, and never force-push a tag the user hasn't told you to move.

Run every command with mise's Node: start each shell with `eval "$(mise env -s bash)"` (the shell's own Node can be too old for lint).

## 1. Check the starting point

- `git status --short` is clean, and the branch is `main`, up to date with `origin/main` (`git fetch origin && git status -sb`). If not, tell the user and ask how to proceed. Don't switch branches or pull over their work yourself.
- The current version: `node -e "import('./scripts/packages.mjs').then((m) => console.log(m.sharedVersion()))"` (it exits with a message if the packages disagree).
- The last release: `git tag -l 'v*' --sort=-v:refname | head -1` (none before the first release).

## 2. Make sure there are changesets

List the pending ones: `ls .changeset/*.md | grep -v README.md`, and read each.

If there are none, or they miss changes, draft them from the history since the last tag (`git log --oneline <last-tag>..HEAD`, or the whole history before the first release), grouped by package path (`packages/<name>/`). Write one file per package that changed, so each changelog gets its own entries:

```md
---
'@solid-slopkit/threejs': minor
---

Add orbit controls at `@solid-slopkit/threejs/controls`.
```

Pick the bump with semver while the version is 0.x: `minor` for new features or breaking changes, `patch` for fixes. The fixed group applies the largest bump to every package. Show the user the drafted changesets and the resulting version, and let them edit or confirm before going on. Name the files after what they describe (`.changeset/threejs-orbit-controls.md`).

## 3. Apply them

```bash
pnpm changeset version
```

This writes the new version into every `packages/*/package.json`, appends each package's `CHANGELOG.md` and deletes the applied changesets. Check `git diff --stat` and the new changelog sections, and confirm with `sharedVersion()` that every package has the expected version. Packages without a changeset get a "No changes in this release." entry; that is expected.

## 4. Run the checks

The workflow runs these on a GPU-less Linux runner. Running them first saves a failed release:

```bash
pnpm format:check
pnpm lint
pnpm release:pack                       # builds and packs every package into release/
pnpm -r --filter "./packages/*" typecheck
pnpm test
pnpm --filter docs build && pnpm --filter docs typecheck
node scripts/release-notes.mjs          # the release notes the workflow will publish
```

`release:pack` comes before the typecheck and tests because forms imports `@solid-slopkit/ui` through its built exports. It refuses to pack over existing tarballs, so delete `release/` first if an earlier run left one. `release/` is gitignored.

If something fails, stop and report it with the output. Fixing it is a separate change, not part of the release commit.

## 5. Commit, tag and push (ask first)

Show the user the version, the release notes and the file list, then ask for the go-ahead. After a yes:

```bash
git add -A
git commit -m "chore: release v<version>"
git tag v<version>
```

Pushing publishes the release, so ask again before:

```bash
git push origin main v<version>
```

End the commit message with the attribution lines the conversation gives for commits.

## 6. Watch the workflow

```bash
gh run list --workflow release.yml --limit 1
gh run watch <run-id> --exit-status
gh release view v<version>
```

Report the release URL and the tarballs attached to it. If the run fails, read the failing step's log (`gh run view <run-id> --log-failed`), explain the cause, and ask the user how to proceed. Nothing is published when it fails. After a fix lands on `main`, the tag can be moved to it (`git tag -f v<version> && git push -f origin v<version>`), but only when the user says so. If the tag was already shared, a new patch version is safer.

## Don'ts

- Don't edit versions in `package.json` by hand; changesets own them.
- Don't use `changeset publish` or `changeset pack`: they ask the npm registry what to release, and these packages aren't on npm.
- Don't tick roadmap boxes (`packages/*/docs/roadmap.md`) as part of a release unless the user asked for that roadmap step.
