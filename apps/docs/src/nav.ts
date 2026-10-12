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
        items: [{ title: 'Button', href: '/ui/button' }],
      },
      {
        title: 'Data display',
        items: [
          { title: 'Badge', href: '/ui/badge' },
          { title: 'Divider', href: '/ui/divider' },
          { title: 'Image', href: '/ui/image' },
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
        ],
      },
      {
        title: 'Inputs',
        items: [{ title: 'SegmentedControl', href: '/ui/segmented-control' }],
      },
    ],
  },
];
