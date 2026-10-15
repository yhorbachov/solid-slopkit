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
- [Notifications](components/feedback/notifications/notifications.md): the region notifications appear in, `useNotifications()` and the `notifications` facade
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

- [AngleSlider](components/inputs/angle-slider/angle-slider.md)
- [Autocomplete](components/inputs/autocomplete/autocomplete.md): a text field with suggestions from a list
- [Checkbox](components/inputs/checkbox/checkbox.md): with Checkbox.Group and Checkbox.Card
- [Chip](components/inputs/chip/chip.md): with Chip.Group
- [ColorInput](components/inputs/color-input/color-input.md): a color as text, with a swatch, a ColorPicker dropdown and an eye dropper
- [ColorPicker](components/inputs/color-picker/color-picker.md)
- [Combobox](components/inputs/combobox/combobox.md): the building block for pickers, with createCombobox(), Combobox.Target, Combobox.Dropdown, Combobox.Options, Combobox.Option, Combobox.Group and Combobox.Empty
- [Dropzone](components/inputs/dropzone/dropzone.md): an area that takes dropped or picked files, checks them, and shows whether it would take a drag, with Dropzone.Idle, Dropzone.Accept and Dropzone.Reject
- [Fieldset](components/inputs/fieldset/fieldset.md)
- [FileInput](components/inputs/file-input/file-input.md)
- [Input](components/inputs/input/input.md): the field box, with sections
- [InputWrapper](components/inputs/input-wrapper/input-wrapper.md): label, description and error around a field; `useInputWrapper()`
- [JsonInput](components/inputs/json-input/json-input.md)
- [MultiSelect](components/inputs/multi-select/multi-select.md): several values from a dropdown list, shown as pills, searchable
- [NativeSelect](components/inputs/native-select/native-select.md)
- [NumberInput](components/inputs/number-input/number-input.md): uses the provider locale
- [PasswordInput](components/inputs/password-input/password-input.md)
- [Pill](components/inputs/pill/pill.md): a small tag for a chosen value, with Pill.Group and an optional remove button
- [PillsInput](components/inputs/pills-input/pills-input.md): a field box of pills and PillsInput.Field, the base of MultiSelect and TagsInput
- [PinInput](components/inputs/pin-input/pin-input.md)
- [Radio](components/inputs/radio/radio.md): with Radio.Group and Radio.Card
- [RangeSlider](components/inputs/range-slider/range-slider.md)
- [Rating](components/inputs/rating/rating.md)
- [SegmentedControl](components/inputs/segmented-control/segmented-control.md)
- [Select](components/inputs/select/select.md): one value from a dropdown list, optionally searchable and clearable
- [Slider](components/inputs/slider/slider.md)
- [Switch](components/inputs/switch/switch.md): with Switch.Group
- [TagsInput](components/inputs/tags-input/tags-input.md): free-text tags as pills, added with Enter or a comma, with optional suggestions
- [TextInput](components/inputs/text-input/text-input.md)
- [Textarea](components/inputs/textarea/textarea.md): with autosize

## Navigation

- [Accordion](components/navigation/accordion/accordion.md): sections that open under their headings, one at a time or several
- [AppShell](components/navigation/app-shell/app-shell.md): the app's frame, a sidebar of navigation next to the main area, collapsing on wide screens and a drawer on narrow ones; `useAppShell()`
- [Breadcrumbs](components/navigation/breadcrumbs/breadcrumbs.md): the path to the current page, its children in a list with separators
- [Command](components/navigation/command/command.md): a search over a list of commands, with Command.Input, Command.List, Command.Item, Command.Group, Command.Separator, Command.Empty and Command.Shortcut; CommandDialog puts one in a modal opened with ⌘K
- [NavLink](components/navigation/nav-link/nav-link.md): a link in a navigation list, active for the current page, or a parent of nested links
- [Pagination](components/navigation/pagination/pagination.md): buttons or links to move between pages
- [Stepper](components/navigation/stepper/stepper.md): progress through steps, the current step's content under them
- [TableOfContents](components/navigation/table-of-contents/table-of-contents.md): links to the page's headings, the one being read marked as it scrolls
- [Tabs](components/navigation/tabs/tabs.md): a tablist and its panels, with Tabs.List, Tabs.Tab and Tabs.Panel
- [Tree](components/navigation/tree/tree.md): a hierarchy of nodes that expand, collapse and can be selected, from data

## Overlays

- [Affix](components/overlays/affix/affix.md): content pinned to a spot in the viewport
- [Dialog](components/overlays/dialog/dialog.md): a non-modal window in a corner of the viewport
- [Drawer](components/overlays/drawer/drawer.md): a modal `<dialog>` panel against an edge
- [HoverCard](components/overlays/hover-card/hover-card.md): HoverCard.Target and HoverCard.Dropdown, shown on hover and keyboard focus
- [LoadingOverlay](components/overlays/loading-overlay/loading-overlay.md): an Overlay with a Loader, for content that's loading
- [Menu](components/overlays/menu/menu.md): Menu.Target, Menu.Dropdown, Menu.Item, Menu.Label and Menu.Divider
- [Modal](components/overlays/modal/modal.md): a modal `<dialog>` with a title and close button
- [Modals](components/overlays/modals/modals.md): open modals and confirm modals from code, with `useModals()` and the `modals` facade
- [Overlay](components/overlays/overlay/overlay.md): a layer over its parent
- [Popover](components/overlays/popover/popover.md): Popover.Target and Popover.Dropdown
- [Tooltip](components/overlays/tooltip/tooltip.md): a description shown on hover and keyboard focus

## Utilities

- [Collapse](components/utilities/collapse/collapse.md): Collapse.Title and Collapse.Content, animated in CSS
- [FloatingIndicator](components/utilities/floating-indicator/floating-indicator.md): a box that glides to the active element of a group
- [ScrollArea](components/utilities/scroll-area/scroll-area.md): a scrolling box with thin scrollbars drawn over it
- [Spoiler](components/utilities/spoiler/spoiler.md): content cut to a height, with a control to show the rest
- [Transition](components/utilities/transition/transition.md): enter and exit animations

## Carousel (`@solid-slopkit/ui/carousel`)

A separate entry, because it needs `embla-carousel`, an optional peer dependency: install it next to the package (`pnpm add embla-carousel`). The main entry never imports it.

- [Carousel](carousel/carousel.md): slides moved through by dragging, buttons, arrow keys or indicators, with Carousel.Slide

## Dates (`@solid-slopkit/ui/dates`)

A separate entry for dates and the date components, on native `Date` and `Intl` with no date library.

- [Dates](dates/dates.md): day arithmetic, the month grid, the locale's week, and formatting in the provider's locale
- [Calendar](dates/calendar/calendar.md): days, months or years in keyboard-navigable grids; the base of the pickers
- [MiniCalendar](dates/mini-calendar/mini-calendar.md): a strip of days, previous and next, to choose one day
- [DatePicker](dates/date-picker/date-picker.md): a Calendar that chooses one day, several, or a range
- [MonthPicker](dates/month-picker/month-picker.md): a Calendar of months that chooses one month, several, or a range
- [YearPicker](dates/year-picker/year-picker.md): a Calendar of decades that chooses one year, several, or a range
- [DatePickerInput](dates/date-picker-input/date-picker-input.md): a field that shows days and chooses them in a DatePicker dropdown
- [MonthPickerInput](dates/month-picker-input/month-picker-input.md): a field that shows months and chooses them in a MonthPicker dropdown
- [YearPickerInput](dates/year-picker-input/year-picker-input.md): a field that shows years and chooses them in a YearPicker dropdown
- [DateInput](dates/date-input/date-input.md): a text field for a day, typed or chosen in a DatePicker dropdown
