// The sidebar, by package. Order here is the order shown; add a page by adding its route
// file under src/routes and an entry here. A package's components are grouped like their
// folders in the package (ui: components/layout, components/button, ...).
export interface NavItem {
  title: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
  /** Shown after `items`, each under its own heading. */
  groups?: NavGroup[];
}

export const nav: NavSection[] = [
  {
    title: 'Getting started',
    items: [{ title: 'Introduction', href: '/' }],
  },
  {
    title: 'UI',
    items: [{ title: 'Overview', href: '/ui' }],
    groups: [
      {
        title: 'Layout',
        items: [
          { title: 'AspectRatio', href: '/ui/aspect-ratio' },
          { title: 'Box', href: '/ui/box' },
          { title: 'Center', href: '/ui/center' },
          { title: 'Container', href: '/ui/container' },
          { title: 'Flex', href: '/ui/flex' },
          { title: 'Grid', href: '/ui/grid' },
          { title: 'Group', href: '/ui/group' },
          { title: 'SimpleGrid', href: '/ui/simple-grid' },
          { title: 'Space', href: '/ui/space' },
          { title: 'Stack', href: '/ui/stack' },
        ],
      },
      {
        title: 'Buttons',
        items: [
          { title: 'ActionIcon', href: '/ui/action-icon' },
          { title: 'Burger', href: '/ui/burger' },
          { title: 'Button', href: '/ui/button' },
          { title: 'CloseButton', href: '/ui/close-button' },
          { title: 'CopyButton', href: '/ui/copy-button' },
          { title: 'FileButton', href: '/ui/file-button' },
        ],
      },
      {
        title: 'Data display',
        items: [
          { title: 'Avatar', href: '/ui/avatar' },
          { title: 'BackgroundImage', href: '/ui/background-image' },
          { title: 'Badge', href: '/ui/badge' },
          { title: 'Carousel', href: '/ui/carousel' },
          { title: 'ColorSwatch', href: '/ui/color-swatch' },
          { title: 'Divider', href: '/ui/divider' },
          { title: 'Image', href: '/ui/image' },
          { title: 'Indicator', href: '/ui/indicator' },
          { title: 'NumberFormatter', href: '/ui/number-formatter' },
          { title: 'Table', href: '/ui/table' },
          { title: 'ThemeIcon', href: '/ui/theme-icon' },
          { title: 'Timeline', href: '/ui/timeline' },
        ],
      },
      {
        title: 'Dates',
        items: [
          { title: 'Calendar', href: '/ui/calendar' },
          { title: 'DatePicker', href: '/ui/date-picker' },
          { title: 'MonthPicker', href: '/ui/month-picker' },
          { title: 'YearPicker', href: '/ui/year-picker' },
          { title: 'DatePickerInput', href: '/ui/date-picker-input' },
          { title: 'MonthPickerInput', href: '/ui/month-picker-input' },
          { title: 'YearPickerInput', href: '/ui/year-picker-input' },
          { title: 'DateInput', href: '/ui/date-input' },
          { title: 'MiniCalendar', href: '/ui/mini-calendar' },
        ],
      },
      {
        title: 'Feedback',
        items: [
          { title: 'Alert', href: '/ui/alert' },
          { title: 'Loader', href: '/ui/loader' },
          { title: 'Notification', href: '/ui/notification' },
          { title: 'Notifications', href: '/ui/notifications' },
          { title: 'Progress', href: '/ui/progress' },
          { title: 'RingProgress', href: '/ui/ring-progress' },
          { title: 'SemiCircleProgress', href: '/ui/semi-circle-progress' },
          { title: 'Skeleton', href: '/ui/skeleton' },
        ],
      },
      {
        title: 'Surfaces',
        items: [
          { title: 'Card', href: '/ui/card' },
          { title: 'Paper', href: '/ui/paper' },
        ],
      },
      {
        title: 'Typography',
        items: [
          { title: 'Anchor', href: '/ui/anchor' },
          { title: 'Blockquote', href: '/ui/blockquote' },
          { title: 'Code', href: '/ui/code' },
          { title: 'Highlight', href: '/ui/highlight' },
          { title: 'Kbd', href: '/ui/kbd' },
          { title: 'List', href: '/ui/list' },
          { title: 'Mark', href: '/ui/mark' },
          { title: 'Text', href: '/ui/text' },
          { title: 'Title', href: '/ui/title' },
          { title: 'VisuallyHidden', href: '/ui/visually-hidden' },
        ],
      },
      {
        title: 'Inputs',
        items: [
          { title: 'AngleSlider', href: '/ui/angle-slider' },
          { title: 'Autocomplete', href: '/ui/autocomplete' },
          { title: 'Checkbox', href: '/ui/checkbox' },
          { title: 'Chip', href: '/ui/chip' },
          { title: 'ColorInput', href: '/ui/color-input' },
          { title: 'ColorPicker', href: '/ui/color-picker' },
          { title: 'Combobox', href: '/ui/combobox' },
          { title: 'Dropzone', href: '/ui/dropzone' },
          { title: 'Fieldset', href: '/ui/fieldset' },
          { title: 'FileInput', href: '/ui/file-input' },
          { title: 'Input', href: '/ui/input' },
          { title: 'InputWrapper', href: '/ui/input-wrapper' },
          { title: 'JsonInput', href: '/ui/json-input' },
          { title: 'MultiSelect', href: '/ui/multi-select' },
          { title: 'NativeSelect', href: '/ui/native-select' },
          { title: 'NumberInput', href: '/ui/number-input' },
          { title: 'PasswordInput', href: '/ui/password-input' },
          { title: 'Pill', href: '/ui/pill' },
          { title: 'PillsInput', href: '/ui/pills-input' },
          { title: 'PinInput', href: '/ui/pin-input' },
          { title: 'Radio', href: '/ui/radio' },
          { title: 'RangeSlider', href: '/ui/range-slider' },
          { title: 'Rating', href: '/ui/rating' },
          { title: 'SegmentedControl', href: '/ui/segmented-control' },
          { title: 'Select', href: '/ui/select' },
          { title: 'Slider', href: '/ui/slider' },
          { title: 'Switch', href: '/ui/switch' },
          { title: 'TagsInput', href: '/ui/tags-input' },
          { title: 'TextInput', href: '/ui/text-input' },
          { title: 'Textarea', href: '/ui/textarea' },
        ],
      },
      {
        title: 'Navigation',
        items: [
          { title: 'Accordion', href: '/ui/accordion' },
          { title: 'AppShell', href: '/ui/app-shell' },
          { title: 'Breadcrumbs', href: '/ui/breadcrumbs' },
          { title: 'Command', href: '/ui/command' },
          { title: 'NavLink', href: '/ui/nav-link' },
          { title: 'Pagination', href: '/ui/pagination' },
          { title: 'Stepper', href: '/ui/stepper' },
          { title: 'TableOfContents', href: '/ui/table-of-contents' },
          { title: 'Tabs', href: '/ui/tabs' },
          { title: 'Tree', href: '/ui/tree' },
        ],
      },
      {
        title: 'Overlays',
        items: [
          { title: 'Affix', href: '/ui/affix' },
          { title: 'Dialog', href: '/ui/dialog' },
          { title: 'Drawer', href: '/ui/drawer' },
          { title: 'HoverCard', href: '/ui/hover-card' },
          { title: 'LoadingOverlay', href: '/ui/loading-overlay' },
          { title: 'Menu', href: '/ui/menu' },
          { title: 'Modal', href: '/ui/modal' },
          { title: 'Modals', href: '/ui/modals' },
          { title: 'Overlay', href: '/ui/overlay' },
          { title: 'Popover', href: '/ui/popover' },
          { title: 'Tooltip', href: '/ui/tooltip' },
        ],
      },
      {
        title: 'Utilities',
        items: [
          { title: 'Collapse', href: '/ui/collapse' },
          { title: 'FloatingIndicator', href: '/ui/floating-indicator' },
          { title: 'ScrollArea', href: '/ui/scroll-area' },
          { title: 'Spoiler', href: '/ui/spoiler' },
          { title: 'Transition', href: '/ui/transition' },
        ],
      },
    ],
  },
];
