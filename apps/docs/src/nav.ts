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
        title: 'Feedback',
        items: [
          { title: 'Alert', href: '/ui/alert' },
          { title: 'Loader', href: '/ui/loader' },
          { title: 'Notification', href: '/ui/notification' },
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
          { title: 'Checkbox', href: '/ui/checkbox' },
          { title: 'Chip', href: '/ui/chip' },
          { title: 'ColorPicker', href: '/ui/color-picker' },
          { title: 'Fieldset', href: '/ui/fieldset' },
          { title: 'FileInput', href: '/ui/file-input' },
          { title: 'Input', href: '/ui/input' },
          { title: 'InputWrapper', href: '/ui/input-wrapper' },
          { title: 'JsonInput', href: '/ui/json-input' },
          { title: 'NativeSelect', href: '/ui/native-select' },
          { title: 'NumberInput', href: '/ui/number-input' },
          { title: 'PasswordInput', href: '/ui/password-input' },
          { title: 'PinInput', href: '/ui/pin-input' },
          { title: 'Radio', href: '/ui/radio' },
          { title: 'RangeSlider', href: '/ui/range-slider' },
          { title: 'Rating', href: '/ui/rating' },
          { title: 'SegmentedControl', href: '/ui/segmented-control' },
          { title: 'Slider', href: '/ui/slider' },
          { title: 'Switch', href: '/ui/switch' },
          { title: 'TextInput', href: '/ui/text-input' },
          { title: 'Textarea', href: '/ui/textarea' },
        ],
      },
      {
        title: 'Utilities',
        items: [
          { title: 'Collapse', href: '/ui/collapse' },
          { title: 'Transition', href: '/ui/transition' },
        ],
      },
    ],
  },
];
