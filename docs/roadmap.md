# @solid-slopkit/ui roadmap to 0.0.1

0.0.1 is the first release. It ships the components listed below (ADR 0006). Decisions live in [docs/adr](./adr) and vocabulary in [CONTEXT.md](../CONTEXT.md).

## Rules for agents

- **Do one step at a time.** Only implement the step you were asked for, identified by its ID (e.g. `M1.04`). Don't start the next step, finish a whole milestone, or build "while I'm here" extras, even when the next step looks small or obviously related.
- A step that needs a primitive or component that doesn't exist yet is **blocked**. Say so and stop; don't build the dependency inside the step.
- A step marked **Gate** is a decision the maintainer makes. Don't implement anything that depends on it until the gate is marked decided.
- When a step is done, tick its box in this file in the same commit.
- The API of each component is chosen on its merits (ADR 0006). Compare options and recommend one; don't copy another library.
- The default theme's values are a work in progress until M8.02. Don't tune them inside other steps; components read only tokens, so they follow whatever the theme ends up being.

## Definition of done (every component step)

- Keyboard and ARIA behavior tested.
- `axe-core` passes for each variant and state the tests render.
- `toHaveNoDiagnostics()`, plus a re-run budget on the main interaction (`@solidjs/diagnostics/vitest`).
- An SSR test: the server render hydrates without a mismatch, and the server log has no Solid diagnostics (e.g. `SERVER_WRITE`). Put the scenarios in `<component>.fixtures.tsx` (functions returning JSX) and assert each one with `expectHydration('./<component>.fixtures.tsx', '<name>')` from `packages/ui/test/ssr.tsx`.
- Tests that need the top layer, focus, layout, positioning or real key events go in the browser project (`*.browser.test.tsx`), the rest in jsdom.
- CSS reads only tokens (no `light-dark()`, no hard-coded colors; black, white and transparent as mixing primitives for shading are fine), and goes in `@layer slopkit.components` (ADR 0005).
- Built-in strings (accessible names, empty states) are props with English defaults.
- Styling contract (ADR 0013): `.slp-<component>` on the root, `data-slot="<component>-<part>"` on every inner part, state and variant as `data-*` attributes, public custom properties only for values that feed several derived declarations (e.g. color).
- A docs page with examples and the props, verified in light and dark. The LLM reference (`<component>.md` next to the source, ADR 0012) and the relevant skill are updated.
- Exported from the package entry, and listed in the docs sidebar and the UI overview.

## Done

Layout: Box, Flex, Stack, Group, SimpleGrid, Grid, Container, Center, AspectRatio, Space. Buttons: ActionIcon, Burger, Button, CloseButton, CopyButton, FileButton. Inputs: AngleSlider, Autocomplete, Checkbox, Chip, ColorInput, ColorPicker, Combobox, Dropzone, Fieldset, FileInput, Input, InputWrapper, JsonInput, MultiSelect, NativeSelect, NumberInput, PasswordInput, Pill, PillsInput, PinInput, Radio, RangeSlider, Rating, SegmentedControl, Select, Slider, Switch, TagsInput, TextInput, Textarea. Typography: Text, Title, Anchor, Kbd, Code, Blockquote, List, Mark, Highlight, VisuallyHidden. Surfaces: Paper, Card. Data display: Badge, Carousel (`@solid-slopkit/ui/carousel`), Divider, Image, BackgroundImage, Avatar, ThemeIcon, ColorSwatch, Indicator, Timeline, Table, NumberFormatter. Feedback: Loader, Skeleton, Progress, RingProgress, SemiCircleProgress, Alert, Notification, Notifications. Navigation: Accordion, AppShell, Breadcrumbs, Command (with CommandDialog), NavLink, Pagination, Stepper, TableOfContents, Tabs, Tree. Overlays: Affix, Dialog, Drawer, HoverCard, LoadingOverlay, Menu, Modal, Modals, Overlay, Popover, Tooltip. Utilities: Collapse, FloatingIndicator, ScrollArea, Spoiler, Transition. Provider: SlopkitUi (generated style registry, notification and modal stores).

---

## M0 — Foundations

- [x] **M0.01** Clean up `package.json`: remove the `./dates` export until M7, make `./slopkit.css` / `./slopkit.min.css` / `./styles/*` point at files the build actually produces (or remove them), and keep `files` in line with ADR 0012 (`dist`, `llm`, `skills`).
- [x] **M0.02** Silence the `$$moduleUrl` `NAMESPACE_CONFLICT` warning in the docs production build. The Solid plugin adds `export const $$moduleUrl` to every module it compiles for the server except under `node_modules`. The docs app resolves `@solid-slopkit/ui` through a workspace symlink to `packages/ui`, so our `export *` index files re-export several. Consumers install the tarball under `node_modules` and never get it, which was verified with a packed tarball in a scratch SSR app. Fixed with a narrow warning filter in `apps/docs/vite.config.ts`.
- [x] **M0.03** Make `pnpm lint` run. oxlint fails to load `oxlint.config.ts` ("Unknown file extension .ts") on Node 22.17, so linting is currently off. Make it work on the Node versions the repo supports, then fix or report what the restored lint finds.
- [x] **M0.04** Move to pnpm 12 and refresh dependencies. The `packageManager` pin is gone, and the lockfile was regenerated from scratch: Solid rc.14, vite-plugin next.49, router next.38, vite 8.3.4, oxlint 1.87, playwright 1.64, and `@types/node` ^24 to match the Node pin.
- [x] **M0.05** Make `pnpm format:check` pass. Eight files predate it and aren't formatted: root `package.json`, `.zed/settings.json`, `file-routes.d.ts`, `pnpm-workspace.yaml`, `apps/docs/src/routes/ui/button.tsx`, `packages/ui/src/styles/slopkit.css`, and both `packages/ui` tsconfigs. Run `oxfmt`, or ignore generated files, and keep the result committed.
- [x] **M0.06** Upgrade to TypeScript 7 (the native compiler). TS 7 changed the `rootDir` default, which nested the output under `dist/*/src/`, so `tsconfig.build.json` now sets `rootDir: "src"`. Afterwards the emitted `.jsx`/`.js` were byte-identical to TS 5.9's, the `.d.ts` differed only cosmetically, and a tarball consumer type-checks with both TS 5.9 and TS 7.
- [x] **M0.07** Upgrade jsdom 25 → 30. The 20 "Could not parse CSS stylesheet" messages are gone (jsdom 25 rejected the provider's generated `@layer` rules), and the tests still pass. `engines.node` is now jsdom 30's range, `^22.22.2 || >=24.15.0`.
- [x] **M0.08** `pnpm release:pack`: build and `pnpm pack` into `release/`, refusing to overwrite an existing tarball. `.github/workflows/release-ui.yml` runs on a `ui-v<version>` tag: it checks the tag against the package version, runs every check, packs, and attaches the tarball to a GitHub Release (ADR 0001). The install docs on the UI overview point at the release URL (the repo is public, so no token is needed).
- [x] **M0.09** A vitest browser project (Chromium via `@vitest/browser-playwright`) next to jsdom, for `*.browser.test.tsx`. It loads the real stylesheets. The first browser test checks that the SegmentedControl indicator covers the selected item, and the release workflow installs Chromium.
- [x] **M0.10** An SSR/hydration test helper that every component's SSR test uses: `packages/ui/test/ssr.tsx`. Its own Vite server compiles each fixture for the server and, hydratably, for the client (Vitest's transform never produces hydratable code). It fails on any console message or thrown error on either side, and on any server element hydration didn't reuse.
- [x] **M0.11** The default theme gets a dark set with `light-dark()`. Add `color-scheme` and `[data-slp-color-scheme]` in `slopkit.base` (ADR 0005).
- [x] **M0.12** `useColorScheme()` on the provider: preference plus resolved scheme, persistence, and the pre-hydration head script.
- [x] **M0.13** `locale` on the provider, used by `Intl` (ADR 0009).
- [x] **M0.15** Docs site: color scheme toggle on every page.
- [x] **M0.16** LLM references: a handwritten `<component>.md` next to each component and the provider, an index in `src/llms.md`, and the build ships them in `dist/source/` (ADR 0012).
- [x] **M0.17** `skills/` scaffold with the first skills: theming and color scheme, layout and style props.
- [x] **M0.18** Box and Flex meet the definition of done.
- [x] **M0.19** Stack meets the definition of done.
- [x] **M0.20** Group meets the definition of done.
- [x] **M0.21** SimpleGrid meets the definition of done.
- [x] **M0.22** Grid meets the definition of done.
- [x] **M0.23** Container meets the definition of done.
- [x] **M0.24** Center meets the definition of done.
- [x] **M0.25** AspectRatio meets the definition of done.
- [x] **M0.26** Space meets the definition of done.
- [x] **M0.27** Button meets the definition of done.
- [x] **M0.28** SegmentedControl meets the definition of done.
- [x] **M0.29** Align Button and SegmentedControl with the styling contract (ADR 0013): add `data-slot` to SegmentedControl's inner parts (Button has none), and remove `--slp-button-border-radius` in favor of selectors. `--slp-segmented-control-radius` stays: it also drives the indicator's and labels' radius.

## Gate — Styling contract for parts

- [x] **G1** Maintainer decides the styling contract for component parts. Decided in ADR 0013.

## M1 — Display and typography

- [x] **M1.01** Text
- [x] **M1.02** Title
- [x] **M1.03** Anchor
- [x] **M1.04** Paper
- [x] **M1.05** Card (with sections)
- [x] **M1.06** Divider
- [x] **M1.07** Badge
- [x] **M1.08** Kbd
- [x] **M1.09** Code
- [x] **M1.10** Blockquote
- [x] **M1.11** List
- [x] **M1.12** Mark
- [x] **M1.13** Highlight
- [x] **M1.14** Image
- [x] **M1.15** BackgroundImage
- [x] **M1.16** Avatar (with Avatar.Group)
- [x] **M1.17** ThemeIcon
- [x] **M1.18** ColorSwatch
- [x] **M1.19** Indicator
- [x] **M1.20** Loader. Button's `loading` keeps its own spinner, by the maintainer's decision.
- [x] **M1.21** Skeleton
- [x] **M1.22** Progress
- [x] **M1.23** RingProgress
- [x] **M1.24** SemiCircleProgress
- [x] **M1.25** Alert. The close button came with CloseButton (M1.32).
- [x] **M1.26** Notification (the visual component only; the manager is M6). The close button came with CloseButton (M1.32).
- [x] **M1.27** Timeline
- [x] **M1.28** Table
- [x] **M1.29** NumberFormatter (uses provider `locale`)
- [x] **M1.30** VisuallyHidden
- [x] ~~**M1.31** UnstyledButton~~ Dropped by the maintainer's decision: a plain `button` does the job, and later buttons build on it directly.
- [x] **M1.32** CloseButton. Alert and Notification got their close button with it (`onClose`, `closeButtonLabel`).
- [x] **M1.33** ActionIcon
- [x] **M1.34** CopyButton
- [x] **M1.35** FileButton
- [x] **M1.36** Burger
- [x] **M1.37** AppShell: a collapsible sidebar (off the canvas, to icons, or not at all) next to the main area, a modal drawer below 48em, with groups, menus, rows, a trigger, a rail and the `mod+B` shortcut; `useAppShell()`. Built after the overlays (M3), whose presence, dismissal and focus primitives its drawer uses.

## M2 — Inputs

- [x] **M2.01** Primitive: list/arrow navigation (horizontal and vertical); move SegmentedControl onto it
- [x] **M2.02** Input and InputWrapper (label, description, error, sections)
- [x] **M2.03** Fieldset
- [x] **M2.04** TextInput
- [x] **M2.05** Textarea (with autosize)
- [x] **M2.06** PasswordInput
- [x] **M2.07** NumberInput (uses provider `locale`)
- [x] **M2.08** NativeSelect
- [x] **M2.09** Checkbox (with Checkbox.Group and Checkbox.Card)
- [x] **M2.10** Radio (with Radio.Group and Radio.Card)
- [x] **M2.11** Switch (with Switch.Group)
- [x] **M2.12** Chip (with Chip.Group)
- [x] **M2.13** PinInput
- [x] **M2.14** Rating
- [x] **M2.15** Slider
- [x] **M2.16** RangeSlider
- [x] **M2.17** AngleSlider
- [x] **M2.18** FileInput
- [x] **M2.19** JsonInput
- [x] **M2.20** ColorPicker

## M3 — Overlays

- [x] **M3.01** Primitive: floating positioning on `@floating-ui/dom` (logical placements)
- [x] **M3.02** Primitive: presence (enter/exit transitions, including top-layer transitions)
- [x] **M3.03** Primitive: dismissal and the provider's nested-overlay order (ADR 0009, ADR 0011)
- [x] **M3.04** Primitive: focus management (initial focus, restore, containment outside `<dialog>`)
- [x] **M3.05** Primitive: typeahead
- [x] **M3.06** Transition
- [x] **M3.07** Collapse
- [x] **M3.08** Popover (Popover API)
- [x] **M3.09** Tooltip
- [x] **M3.10** HoverCard
- [x] **M3.11** Menu
- [x] **M3.12** Overlay
- [x] **M3.13** Modal (`<dialog>`)
- [x] **M3.21** Primitive: scroll locking, with scrollbar compensation (ADR 0007), used by Modal and Drawer
- [x] **M3.14** Drawer (`<dialog>`)
- [x] **M3.15** Dialog
- [x] **M3.16** LoadingOverlay
- [x] **M3.17** Affix
- [x] **M3.18** ScrollArea
- [x] **M3.19** Spoiler
- [x] **M3.20** FloatingIndicator

## M4 — Combobox family

- [x] **M4.01** Combobox (the building block)
- [x] **M4.02** Pill
- [x] **M4.03** PillsInput
- [x] **M4.04** Select
- [x] **M4.05** Autocomplete
- [x] **M4.06** MultiSelect
- [x] **M4.07** TagsInput
- [x] **M4.08** ColorInput

## M5 — Navigation and disclosure

- [x] **M5.01** Tabs
- [x] **M5.02** Accordion
- [x] **M5.03** Stepper
- [x] **M5.04** Pagination
- [x] **M5.05** Breadcrumbs
- [x] **M5.06** NavLink
- [x] **M5.07** Tree
- [x] **M5.08** TableOfContents

## M6 — Managers and extensions

- [x] **M6.01** Notifications: provider store, `useNotifications()`, the client-only `notifications` facade, and the region as a manual popover (ADR 0009, ADR 0011)
- [x] **M6.02** Modals manager: provider store, `useModals()`, the `modals` facade, confirm modal
- [x] **M6.03** Command and CommandDialog: a composable search over commands, inline or in a modal opened with ⌘K (replaced the provider-driven Spotlight)
- [x] **M6.04** Dropzone (own implementation, no dependency)
- [x] **M6.05** Carousel at `@solid-slopkit/ui/carousel`, with `embla-carousel` as an optional peer (ADR 0002)

## M7 — Dates (`@solid-slopkit/ui/dates`, native `Date` + `Intl`, ADR 0003)

- [x] **M7.01** Add the `./dates` subpath export, plus date utilities on `Date` and `Intl` (week start, month grid, formatting by provider `locale`)
- [ ] **M7.02** Primitive: grid keyboard navigation (days, months, years)
- [ ] **M7.03** Calendar
- [ ] **M7.04** MiniCalendar
- [ ] **M7.05** DatePicker
- [ ] **M7.06** MonthPicker
- [ ] **M7.07** YearPicker
- [ ] **M7.08** DatePickerInput
- [ ] **M7.09** MonthPickerInput
- [ ] **M7.10** YearPickerInput
- [ ] **M7.11** DateInput
- [ ] **M7.12** TimeInput
- [ ] **M7.13** TimePicker
- [ ] **M7.14** TimeGrid
- [ ] **M7.15** DateTimePicker

## M8 — Release 0.0.1

- [ ] **M8.01** Export the stable primitives from `@solid-slopkit/ui/primitives` (ADR 0007)
- [ ] **M8.02** Decide the default theme's values (it is a work in progress until then), then write the docs Theming page and the theming skill (both removed until then, so they can't mislead) and update the LLM references that quote them.
- [ ] **M8.03** Audit the docs, LLM references and skills against the shipped API
- [ ] **M8.04** Tag `ui-v0.0.1` and publish the GitHub Release

## Not in 0.0.1

Charts, CodeHighlight, RichTextEditor and NavigationProgress (ADR 0006). Portal and a FocusTrap component are replaced by the top layer and primitives (ADR 0011, ADR 0007). Style props on non-layout components (ADR 0008), app-wide default props (ADR 0005), translation dictionaries (ADR 0009), generic utility hooks (ADR 0006) and configurable breakpoints are deferred or out.
