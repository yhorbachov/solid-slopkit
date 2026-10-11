# slopkit UI

A component library for SolidJS 2.x. Each component's API and look are chosen on their own merits.

## Language

### Building blocks

**Component**:
Something an app renders from `@solid-slopkit/ui`, such as `Button` or `Select`. It has a look and a public prop API.

**Layout component**:
A component whose job is arranging other content (Box, Flex, Stack, Group, Grid, …). Only layout components take style props.
_Avoid_: container (which is one specific layout component), wrapper

**Style prop**:
A prop on a layout component that sets one CSS property, optionally per breakpoint, such as `p`, `w` or `gap`.
_Avoid_: system prop, utility prop

**Provider**:
The `<SlopkitUi>` component at the root of an app, which holds everything shared by the components under it (generated styles, color scheme preference, notifications, overlays).
_Avoid_: context, root, app wrapper

**Slot**:
A named inner part of a component that users can target with CSS, such as `select-dropdown` or `card-title`. Always prefixed with the component's name.
_Avoid_: part, element, section (which is a Button prop)

**Primitive**:
A reusable piece of behavior with no markup or look of its own, such as a focus trap, dismissal or list keyboard navigation. Components are built by composing primitives.
_Avoid_: hook, behavior, utility, headless component

### Docs

**Skill**:
A task-oriented guide for coding agents (`skills/<area>/SKILL.md`), shipped in the package.
_Avoid_: guide, recipe

**LLM reference**:
The handwritten Markdown page for one component or the provider (`<component>.md`, next to its source), shipped in the package. `llms.md` is their index.
_Avoid_: llms.txt (that is only the index), API docs

### Color

**Color role**:
A named purpose a color serves: `primary`, `secondary`, `accent`, `neutral`, `info`, `success`, `warning` or `error`. A theme assigns each role a concrete color.
_Avoid_: semantic color, theme color, brand color

**Content color**:
The foreground color that stays readable on top of a color role, e.g. `primary-content`.
_Avoid_: on-color, contrast color, foreground

**Base colors**:
The surface colors (`base-100`, `base-200`, `base-300`) and the text color on them (`base-content`), used where no color role applies.
_Avoid_: background, neutral (which is a color role)

**Palette**:
A named scale of ten shades (`red-0` … `red-9`) that app authors can use directly. Components never read a palette's shades on their own.
_Avoid_: swatch, color scale

**Theme**:
A complete set of values for the color roles, content colors, base colors and shape tokens (radius, size, border, depth), applied to a page or any part of it.
_Avoid_: skin, color scheme (a color scheme is the light/dark choice)

**Color scheme**:
Whether a part of the page renders light or dark. A theme supports one or both schemes; the user's **color scheme preference** (`light`, `dark` or `auto`) picks between them.
_Avoid_: mode, dark theme (when you mean the scheme)
