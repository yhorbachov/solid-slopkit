# @solid-slopkit/ui

A component library for SolidJS 2.x, styled with plain CSS and CSS variables. Solid is not React: components run once, and reactivity comes from signals.

Each link below is the reference for one component: its props, examples, and the selectors and CSS variables to customize it with. Paths are relative to this file.

Task guides live next to `dist/` in the package, at `node_modules/@solid-slopkit/ui/skills/<area>/SKILL.md`:

- `skills/layout/SKILL.md`: pick a layout component, style props, responsive values.

## Setup

```tsx
import { SlopkitUi } from '@solid-slopkit/ui';
import '@solid-slopkit/ui/styles/slopkit.css';
import '@solid-slopkit/ui/styles/default-theme.css';

export function Root() {
  return <SlopkitUi>{/* your app */}</SlopkitUi>;
}
```

- [SlopkitUi](components/provider/slopkit-ui.md): the provider, required at the root. Locale (`useLocale()`) and the color scheme (`useColorScheme()`).

## Conventions

- `style` takes an object with kebab-case keys, on every component: `style={{ 'max-width': '20rem' }}`. A CSS string is a type error.
- `class` takes a string, an array or an object, as on a plain element.

## Theming in one paragraph

A theme is a CSS rule that sets the `--slp-*` tokens: the default theme sets them on `:root`, and any other theme on `[data-slp-theme="<name>"]`, for the whole page or a subtree. Components read only tokens. The `color` prop of a component takes a color role: `primary`, `secondary`, `accent`, `neutral`, `info`, `success`, `warning` or `error`. A one-off color goes through the component's CSS variable, like `--slp-button-color`. Every component rule lives in `@layer slopkit.components`, so unlayered app CSS overrides it.

## Layout

Only layout components take style props, and each takes its own set. The Box reference documents them all, with the spacing scale and the responsive syntax.

- [Box](components/layout/box/box.md): a div with style props. Includes the style props reference.
- [Flex](components/layout/flex/flex.md)
- [Stack](components/layout/stack/stack.md)
- [Group](components/layout/group/group.md)
- [SimpleGrid](components/layout/simple-grid/simple-grid.md)
- [Grid](components/layout/grid/grid.md)
- [Container](components/layout/container/container.md)
- [Center](components/layout/center/center.md)
- [AspectRatio](components/layout/aspect-ratio/aspect-ratio.md)
- [Space](components/layout/space/space.md)

## Buttons

- [ActionIcon](components/button/action-icon/action-icon.md)
- [Burger](components/button/burger/burger.md)
- [Button](components/button/button/button.md)
- [CloseButton](components/button/close-button/close-button.md)
- [CopyButton](components/button/copy-button/copy-button.md)
- [FileButton](components/button/file-button/file-button.md)

## Data display

- [Avatar](components/data-display/avatar/avatar.md): with Avatar.Group
- [BackgroundImage](components/data-display/background-image/background-image.md)
- [Badge](components/data-display/badge/badge.md)
- [ColorSwatch](components/data-display/color-swatch/color-swatch.md)
- [Divider](components/data-display/divider/divider.md)
- [Image](components/data-display/image/image.md)
- [Indicator](components/data-display/indicator/indicator.md)
- [NumberFormatter](components/data-display/number-formatter/number-formatter.md)
- [Table](components/data-display/table/table.md)
- [ThemeIcon](components/data-display/theme-icon/theme-icon.md)
- [Timeline](components/data-display/timeline/timeline.md)

## Feedback

- [Alert](components/feedback/alert/alert.md)
- [Loader](components/feedback/loader/loader.md)
- [Notification](components/feedback/notification/notification.md)
- [Progress](components/feedback/progress/progress.md)
- [RingProgress](components/feedback/ring-progress/ring-progress.md)
- [SemiCircleProgress](components/feedback/semi-circle-progress/semi-circle-progress.md)
- [Skeleton](components/feedback/skeleton/skeleton.md)

## Surfaces

- [Card](components/surfaces/card/card.md)
- [Paper](components/surfaces/paper/paper.md)

## Typography

- [Anchor](components/typography/anchor/anchor.md)
- [Blockquote](components/typography/blockquote/blockquote.md)
- [Code](components/typography/code/code.md)
- [Highlight](components/typography/highlight/highlight.md)
- [Kbd](components/typography/kbd/kbd.md)
- [List](components/typography/list/list.md)
- [Mark](components/typography/mark/mark.md)
- [Text](components/typography/text/text.md)
- [Title](components/typography/title/title.md)
- [VisuallyHidden](components/typography/visually-hidden/visually-hidden.md)

## Inputs

- [Checkbox](components/inputs/checkbox/checkbox.md): with Checkbox.Group and Checkbox.Card
- [Chip](components/inputs/chip/chip.md): with Chip.Group
- [Fieldset](components/inputs/fieldset/fieldset.md)
- [Input](components/inputs/input/input.md): the field box, with sections
- [InputWrapper](components/inputs/input-wrapper/input-wrapper.md): label, description and error around a field; `useInputWrapper()`
- [NativeSelect](components/inputs/native-select/native-select.md)
- [NumberInput](components/inputs/number-input/number-input.md): uses the provider locale
- [PasswordInput](components/inputs/password-input/password-input.md)
- [PinInput](components/inputs/pin-input/pin-input.md)
- [Radio](components/inputs/radio/radio.md): with Radio.Group and Radio.Card
- [Rating](components/inputs/rating/rating.md)
- [SegmentedControl](components/inputs/segmented-control/segmented-control.md)
- [Switch](components/inputs/switch/switch.md): with Switch.Group
- [TextInput](components/inputs/text-input/text-input.md)
- [Textarea](components/inputs/textarea/textarea.md): with autosize
