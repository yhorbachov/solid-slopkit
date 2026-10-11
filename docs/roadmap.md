# @slopkit/ui roadmap to 0.0.1

0.0.1 is the first release. It ships nearly every component in Mantine's set (ADR 0006). Decisions live in [docs/adr](./adr) and vocabulary in [CONTEXT.md](../CONTEXT.md).

## Rules for agents

- **Do one step at a time.** Only implement the step you were asked for, identified by its ID (e.g. `M1.04`). Don't start the next step, finish a whole milestone, or build "while I'm here" extras, even when the next step looks small or obviously related.
- A step that needs a primitive or component that doesn't exist yet is **blocked**. Say so and stop; don't build the dependency inside the step.
- A step marked **Gate** is a decision the maintainer makes. Don't implement anything that depends on it until the gate is marked decided.
- When a step is done, tick its box in this file in the same commit.
- The API of each component is chosen on its merits, comparing Mantine, daisyUI, Chakra and others (ADR 0006). Propose deviations; don't copy one library.

## Definition of done (every component step)

- Keyboard and ARIA behavior tested, including arrow keys flipping under `dir="rtl"`.
- `axe-core` passes for each variant and state the tests render.
- `toHaveNoDiagnostics()`, plus a re-run budget on the main interaction (`@solidjs/diagnostics/vitest`).
- An SSR test: the server render hydrates without a mismatch, and the server log has no Solid diagnostics (e.g. `SERVER_WRITE`).
- Tests that need the top layer, focus, layout, positioning or real key events go in the browser project (`*.browser.test.tsx`), the rest in jsdom.
- CSS uses only logical properties, reads only tokens (no `light-dark()`, no hard-coded colors), and goes in `@layer slopkit.components` (ADR 0005).
- Built-in strings (accessible names, empty states) are props with English defaults.
- Styling contract (ADR 0013): `.slp-<component>` on the root, `data-slot="<component>-<part>"` on every inner part, state and variant as `data-*` attributes, public custom properties only for values that feed several derived declarations (e.g. color).
- A docs page with examples and the props, verified in light and dark and in LTR and RTL. The LLM reference is generated from it (ADR 0012), and the relevant skill is updated.
- Exported from the package entry, and listed in the docs sidebar and the UI overview.

## Done

Layout: Box, Flex, Stack, Group, SimpleGrid, Grid, Container, Center, AspectRatio, Space. Buttons: Button. Inputs: SegmentedControl. Provider: SlopkitUi (generated style registry).

---

## M0 — Foundations

- [x] **M0.01** Clean up `package.json`: remove the `./dates` export until M7, make `./slopkit.css` / `./slopkit.min.css` / `./styles/*` point at files the build actually produces (or remove them), and keep `files` in line with ADR 0012 (`dist`, `llm`, `skills`).
- [x] **M0.02** Silence the `$$moduleUrl` `NAMESPACE_CONFLICT` warning in the docs production build. The Solid plugin adds `export const $$moduleUrl` to every module it compiles for the server except under `node_modules`. The docs app resolves `@slopkit/ui` through a workspace symlink to `packages/ui`, so our `export *` index files re-export several. Consumers install the tarball under `node_modules` and never get it, which was verified with a packed tarball in a scratch SSR app. Fixed with a narrow warning filter in `apps/docs/vite.config.ts`.
- [x] **M0.03** Make `pnpm lint` run. oxlint fails to load `oxlint.config.ts` ("Unknown file extension .ts") on Node 22.17, so linting is currently off. Make it work on the Node versions the repo supports, then fix or report what the restored lint finds.
- [ ] **M0.04** `pnpm release:pack`: build and `pnpm pack` into `release/`. Add a workflow that attaches the tarball to a GitHub Release tagged `ui-v<version>` (ADR 0001). Write install docs, including the token needed while the repo is private.
- [ ] **M0.05** A vitest browser project (Chromium via `@vitest/browser-playwright`) next to jsdom, for `*.browser.test.tsx`.
- [ ] **M0.06** An SSR/hydration test helper that every component's SSR test uses.
- [ ] **M0.07** The default theme gets a dark set with `light-dark()`. Add `color-scheme` and `[data-slp-color-scheme]` in `slopkit.base` (ADR 0005).
- [ ] **M0.08** `useColorScheme()` on the provider: preference plus resolved scheme, persistence, and the pre-hydration head script.
- [ ] **M0.09** `locale` on the provider, used by `Intl` (ADR 0009).
- [ ] **M0.10** Palette shorthand and raw colors in `color` (ADR 0004), applied to Button and SegmentedControl.
- [ ] **M0.11** Docs site: color scheme toggle and RTL toggle on every page.
- [ ] **M0.12** LLM reference generator: docs pages plus props from types → `llm/<name>.md` and `llm/index.md`. Docs site serves `/llms.txt` and `/llms-full.txt` (ADR 0012).
- [ ] **M0.13** `skills/` scaffold with the first skills: theming and color scheme, layout and style props.
- [ ] **M0.14** Box and Flex meet the definition of done.
- [ ] **M0.15** Stack meets the definition of done.
- [ ] **M0.16** Group meets the definition of done.
- [ ] **M0.17** SimpleGrid meets the definition of done.
- [ ] **M0.18** Grid meets the definition of done.
- [ ] **M0.19** Container meets the definition of done.
- [ ] **M0.20** Center meets the definition of done.
- [ ] **M0.21** AspectRatio meets the definition of done.
- [ ] **M0.22** Space meets the definition of done.
- [ ] **M0.23** Button meets the definition of done.
- [ ] **M0.24** SegmentedControl meets the definition of done.
- [ ] **M0.25** Align Button and SegmentedControl with the styling contract (ADR 0013): add `data-slot` to their inner parts, and remove `--slp-button-border-radius` and `--slp-segmented-control-radius` in favor of selectors.

## Gate — Styling contract for parts

- [x] **G1** Maintainer decides the styling contract for component parts. Decided in ADR 0013.

## M1 — Display and typography

- [ ] **M1.01** Text
- [ ] **M1.02** Title
- [ ] **M1.03** Anchor
- [ ] **M1.04** Paper
- [ ] **M1.05** Card (with sections)
- [ ] **M1.06** Divider
- [ ] **M1.07** Badge
- [ ] **M1.08** Kbd
- [ ] **M1.09** Code
- [ ] **M1.10** Blockquote
- [ ] **M1.11** List
- [ ] **M1.12** Mark
- [ ] **M1.13** Highlight
- [ ] **M1.14** Image
- [ ] **M1.15** BackgroundImage
- [ ] **M1.16** Avatar (with Avatar.Group)
- [ ] **M1.17** ThemeIcon
- [ ] **M1.18** ColorSwatch
- [ ] **M1.19** Indicator
- [ ] **M1.20** Loader (also used by Button's `loading`)
- [ ] **M1.21** Skeleton
- [ ] **M1.22** Progress
- [ ] **M1.23** RingProgress
- [ ] **M1.24** SemiCircleProgress
- [ ] **M1.25** Alert
- [ ] **M1.26** Notification (the visual component only; the manager is M6)
- [ ] **M1.27** Timeline
- [ ] **M1.28** Table
- [ ] **M1.29** NumberFormatter (uses provider `locale`)
- [ ] **M1.30** VisuallyHidden
- [ ] **M1.31** UnstyledButton
- [ ] **M1.32** CloseButton
- [ ] **M1.33** ActionIcon
- [ ] **M1.34** CopyButton
- [ ] **M1.35** FileButton
- [ ] **M1.36** Burger
- [ ] **M1.37** AppShell

## M2 — Inputs

- [ ] **M2.01** Primitive: list/arrow navigation (direction-aware, RTL); move SegmentedControl onto it
- [ ] **M2.02** Input and InputWrapper (label, description, error, sections)
- [ ] **M2.03** Fieldset
- [ ] **M2.04** TextInput
- [ ] **M2.05** Textarea (with autosize)
- [ ] **M2.06** PasswordInput
- [ ] **M2.07** NumberInput (uses provider `locale`)
- [ ] **M2.08** NativeSelect
- [ ] **M2.09** Checkbox (with Checkbox.Group and Checkbox.Card)
- [ ] **M2.10** Radio (with Radio.Group and Radio.Card)
- [ ] **M2.11** Switch (with Switch.Group)
- [ ] **M2.12** Chip (with Chip.Group)
- [ ] **M2.13** PinInput
- [ ] **M2.14** Rating
- [ ] **M2.15** Slider
- [ ] **M2.16** RangeSlider
- [ ] **M2.17** AngleSlider
- [ ] **M2.18** FileInput
- [ ] **M2.19** JsonInput
- [ ] **M2.20** ColorPicker

## M3 — Overlays

- [ ] **M3.01** Primitive: floating positioning on `@floating-ui/dom` (logical placements)
- [ ] **M3.02** Primitive: presence (enter/exit transitions, including top-layer transitions)
- [ ] **M3.03** Primitive: dismissal and the provider's nested-overlay order (ADR 0009, ADR 0011)
- [ ] **M3.04** Primitive: focus management (initial focus, restore, containment outside `<dialog>`)
- [ ] **M3.05** Primitive: typeahead
- [ ] **M3.06** Transition
- [ ] **M3.07** Collapse
- [ ] **M3.08** Popover (Popover API)
- [ ] **M3.09** Tooltip
- [ ] **M3.10** HoverCard
- [ ] **M3.11** Menu
- [ ] **M3.12** Overlay
- [ ] **M3.13** Modal (`<dialog>`)
- [ ] **M3.14** Drawer (`<dialog>`)
- [ ] **M3.15** Dialog
- [ ] **M3.16** LoadingOverlay
- [ ] **M3.17** Affix
- [ ] **M3.18** ScrollArea
- [ ] **M3.19** Spoiler
- [ ] **M3.20** FloatingIndicator

## M4 — Combobox family

- [ ] **M4.01** Combobox (the building block)
- [ ] **M4.02** Pill
- [ ] **M4.03** PillsInput
- [ ] **M4.04** Select
- [ ] **M4.05** Autocomplete
- [ ] **M4.06** MultiSelect
- [ ] **M4.07** TagsInput
- [ ] **M4.08** ColorInput

## M5 — Navigation and disclosure

- [ ] **M5.01** Tabs
- [ ] **M5.02** Accordion
- [ ] **M5.03** Stepper
- [ ] **M5.04** Pagination
- [ ] **M5.05** Breadcrumbs
- [ ] **M5.06** NavLink
- [ ] **M5.07** Tree
- [ ] **M5.08** TableOfContents

## M6 — Managers and extensions

- [ ] **M6.01** Notifications: provider store, `useNotifications()`, the client-only `notifications` facade, and the region as a manual popover (ADR 0009, ADR 0011)
- [ ] **M6.02** Modals manager: provider store, `useModals()`, the `modals` facade, confirm modal
- [ ] **M6.03** Spotlight
- [ ] **M6.04** Dropzone (own implementation, no dependency)
- [ ] **M6.05** Carousel at `@slopkit/ui/carousel`, with `embla-carousel` as an optional peer (ADR 0002)

## M7 — Dates (`@slopkit/ui/dates`, native `Date` + `Intl`, ADR 0003)

- [ ] **M7.01** Add the `./dates` subpath export, plus date utilities on `Date` and `Intl` (week start, month grid, formatting by provider `locale`)
- [ ] **M7.02** Primitive: grid keyboard navigation (days, months, years; RTL)
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

- [ ] **M8.01** Export the stable primitives from `@slopkit/ui/primitives` (ADR 0007)
- [ ] **M8.02** Audit the docs, LLM references and skills against the shipped API
- [ ] **M8.03** Tag `ui-v0.0.1` and publish the GitHub Release

## Not in 0.0.1

Charts, CodeHighlight, RichTextEditor and NavigationProgress (ADR 0006). Portal and a FocusTrap component are replaced by the top layer and primitives (ADR 0011, ADR 0007). Style props on non-layout components (ADR 0008), app-wide default props (ADR 0005), translation dictionaries (ADR 0009), Mantine's generic utility hooks (ADR 0006) and configurable breakpoints are deferred or out.
