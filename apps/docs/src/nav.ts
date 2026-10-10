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
    items: [
      { title: 'Overview', href: '/ui' },
      { title: 'Theming', href: '/ui/theming' },
    ],
    groups: [
      {
        title: 'Layout',
        items: [
          { title: 'Box', href: '/ui/box' },
          { title: 'Flex', href: '/ui/flex' },
        ],
      },
      {
        title: 'Buttons',
        items: [{ title: 'Button', href: '/ui/button' }],
      },
    ],
  },
];
