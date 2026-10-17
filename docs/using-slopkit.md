# Using slopkit in an app

This guide is for coding agents that add `@solid-slopkit/*` packages to a SolidJS 2.x app. It covers which packages exist, how to install them (they are not on npm), how to wire each one up, and how to make the docs shipped in each package available to future agent sessions. Follow the steps for the packages you were asked to add, and skip the rest.

Repository: https://github.com/yhorbachov/solid-slopkit

## The packages

| Package                  | What it is                                                                                   | Use it for                                   |
| ------------------------ | -------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `@solid-slopkit/ui`      | Components, theming (CSS variables) and the `SlopkitUi` provider.                            | Any app UI: layout, inputs, overlays, data.  |
| `@solid-slopkit/forms`   | Schema-driven form state over a Solid store; `bind(field)` gives the props a UI input takes. | Forms with validation and submit handling.   |
| `@solid-slopkit/i18n`    | Translation files next to the components that use them, compiled by a Vite plugin.           | Translated text and switching the locale.    |
| `@solid-slopkit/threejs` | three.js scenes described with Solid components inside a `Canvas`.                           | 3D scenes, model viewers, anything in WebGL. |

No package depends on another at runtime. They work together through props: `forms` bindings fit `ui` inputs, and `i18n` messages and the active locale go into `ui` components and its provider. Install only what the task needs.

Every package needs `solid-js` and `@solidjs/web` 2.x, which a Solid 2 app already has. The packages ship uncompiled JSX under the `solid` export condition, so the app compiles them with its own Solid plugin (`@solidjs/vite-plugin`). This needs no configuration.

## 1. Find the version

All packages are released together under one version. Every package in an app must have the same version, so install them all from one release.

Get the latest release tag (for example `v0.0.1`; the version is the tag without the `v`):

```bash
curl -s https://api.github.com/repos/yhorbachov/solid-slopkit/releases/latest | grep '"tag_name"'
```

or, with the GitHub CLI:

```bash
gh release view --repo yhorbachov/solid-slopkit --json tagName --jq .tagName
```

## 2. Install

The packages are tarballs attached to the GitHub Release, at:

```
https://github.com/yhorbachov/solid-slopkit/releases/download/v<version>/solid-slopkit-<package>-<version>.tgz
```

`<package>` is `ui`, `forms`, `i18n` or `threejs`. Install the tarballs together with each package's peer dependencies in one command. For example, with version `0.0.1`:

```bash
pnpm add \
  https://github.com/yhorbachov/solid-slopkit/releases/download/v0.0.1/solid-slopkit-ui-0.0.1.tgz \
  https://github.com/yhorbachov/solid-slopkit/releases/download/v0.0.1/solid-slopkit-threejs-0.0.1.tgz \
  three
pnpm add -D @types/three
```

Peer dependencies by package (`solid-js` and `@solidjs/web` aside):

| Package                  | Install alongside                                                   |
| ------------------------ | ------------------------------------------------------------------- |
| `@solid-slopkit/ui`      | `embla-carousel`, only if the app uses `@solid-slopkit/ui/carousel` |
| `@solid-slopkit/forms`   | nothing                                                             |
| `@solid-slopkit/i18n`    | `vite` (an app built with Vite already has it)                      |
| `@solid-slopkit/threejs` | `three` (r171 or later), and `@types/three` as a dev dependency     |

Once installed, the packages are imported by name (`@solid-slopkit/ui`), like any other dependency. `package.json` keeps the tarball URL as the version. pnpm's output prints `@solid-slopkit/<package> <version>` on later installs, but the URL in `package.json` is unchanged and needs no fixing.

## 3. Set up each package

Each package has an index for agents at `node_modules/@solid-slopkit/<package>/dist/source/llms.md`: setup, the API, and links to a reference for every component or topic. Read it for the package you are setting up. The steps below are only the wiring that has to happen once.

### ui

Wrap the app's root component in the provider, and import the two stylesheets there once. In the `pnpm create solid` templates that is `src/App.tsx`, around the `<Router>`. Don't use `src/Document.tsx`: that is the HTML shell, and it ships no client JS.

```tsx
import { SlopkitUi } from '@solid-slopkit/ui';
import '@solid-slopkit/ui/styles/slopkit.css';
import '@solid-slopkit/ui/styles/default-theme.css';

export default function App() {
  return (
    <SlopkitUi>
      <Router>{/* … */}</Router>
    </SlopkitUi>
  );
}
```

- Component rules sit in `@layer slopkit.components`, so any unlayered app CSS overrides them. The template's `src/App.css` styles `body`, `main` and links. Remove what the app doesn't need, or it will fight the theme.
- `@solid-slopkit/ui` exports a `Title` component, and the templates already import `Title` from `@solidjs/meta` (the document title). Rename one of them on import where both are used: `import { Title as PageTitle } from '@solidjs/meta'`.

### forms

No setup. Read `node_modules/@solid-slopkit/forms/skills/forms/SKILL.md` before writing the first form.

### i18n

Add the plugin before the Solid plugin in `vite.config.ts`:

```ts
import { slopkitI18n } from '@solid-slopkit/i18n/vite';

export default defineConfig({
  plugins: [slopkitI18n({ locales: ['en', 'de'], defaultLocale: 'en' }), solid(/* … */)],
});
```

Let TypeScript find the generated types, in `tsconfig.json`:

```jsonc
{
  "compilerOptions": {
    "allowArbitraryExtensions": true,
    "rootDirs": ["src", "node_modules/.slopkit-i18n/types/src"],
  },
}
```

Wrap the app in the provider (inside `SlopkitUi` when both are used, and pass the locale to `SlopkitUi` for date and number formatting; see `guides/slopkit-ui.md` in the i18n package):

```tsx
import { I18nProvider } from '@solid-slopkit/i18n';

<I18nProvider initialLocale="en">{/* the app */}</I18nProvider>;
```

If the project runs `tsc` in CI or a `typecheck` script, run `slopkit-i18n typegen` before it.

### threejs

No setup beyond installing `three`. A scene is a `Canvas` with Scene components from `T` in it:

```tsx
import { Canvas, T } from '@solid-slopkit/threejs';

export function Scene() {
  return (
    <div style={{ height: '400px' }}>
      <Canvas camera={{ position: [0, 0, 4] }}>
        <T.AmbientLight intensity={0.5} />
        <T.DirectionalLight position={[2, 4, 3]} />
        <T.Mesh>
          <T.BoxGeometry />
          <T.MeshStandardMaterial color="hotpink" />
        </T.Mesh>
      </Canvas>
    </div>
  );
}
```

- The `Canvas` fills its parent, so give the parent a size.
- The default camera looks down the negative Z axis from its `position`, and does not turn toward the origin. Keep what the scene shows in front of it, or a correct scene renders an empty canvas.
- three.js is large, so the first build may warn that a chunk is over 500 kB. Load the page or component that holds the `Canvas` lazily to split it out.
- Orbit controls are in `@solid-slopkit/threejs/controls`, the WebGPU renderer in `@solid-slopkit/threejs/webgpu`.

## 4. Make the package docs available to later sessions

Each package ships skills (task guides, `skills/<area>/SKILL.md`) and LLM references (the `llms.md` index and the pages it links). Both always match the installed version. Tell future agents about them in the app's agent instructions: add this section to `AGENTS.md`, keeping only the lines for installed packages. Create the file if the app has none. If the file has a generated block (the templates' `<!-- BEGIN solid-2.0-primer -->` … `<!-- END solid-2.0-primer -->`), add the section after it, never inside it.

```markdown
## slopkit

This app uses `@solid-slopkit/*` packages, installed from GitHub Release tarballs (not npm). All of them must be on the same version: to upgrade, change the version in every `@solid-slopkit` URL in `package.json` together and reinstall.

Read the docs inside the installed packages, not the web; they match the installed version:

- `node_modules/@solid-slopkit/ui/dist/source/llms.md`: one reference per component, the provider, theming. Skills: `node_modules/@solid-slopkit/ui/skills/theming/SKILL.md`, `node_modules/@solid-slopkit/ui/skills/layout/SKILL.md`.
- `node_modules/@solid-slopkit/forms/dist/source/llms.md`. Skill: `node_modules/@solid-slopkit/forms/skills/forms/SKILL.md`.
- `node_modules/@solid-slopkit/i18n/dist/source/llms.md`. Skill: `node_modules/@solid-slopkit/i18n/skills/i18n/SKILL.md`.
- `node_modules/@solid-slopkit/threejs/dist/source/llms.md`. Skills: `node_modules/@solid-slopkit/threejs/skills/{scenes,animation,assets}/SKILL.md`.

Before working with a package, read the skill for the task first, then the reference for each component or API you use.
```

**Claude Code** reads `CLAUDE.md`, not `AGENTS.md`. If the app has no `CLAUDE.md`, create one that contains the line `@AGENTS.md`. To make the skills load on their own when a task matches them, also link each one into `.claude/skills`:

```bash
mkdir -p .claude/skills
for skill in node_modules/@solid-slopkit/*/skills/*/; do
  ln -sfn "../../$skill" ".claude/skills/$(sed -n 's/^name: //p' "$skill/SKILL.md")"
done
```

Commit the links. They are relative and point into `node_modules`, so they resolve after `pnpm install` on any clone and follow upgrades. Run the loop again after an upgrade or after adding a package, to pick up new skills.

## 5. Check it works

1. `pnpm build` succeeds, and `pnpm exec tsc --noEmit` reports no errors (run `pnpm exec slopkit-i18n typegen` first if i18n is installed).
2. `pnpm dev`, open the app, and check that the components render with the theme applied and the browser console shows no errors. A `Canvas` should show the scene, not an empty canvas.
