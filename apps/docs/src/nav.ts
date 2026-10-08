// The sidebar, by package. Order here is the order shown; add a page by adding its route
// file under src/routes and an entry here.
export interface NavItem {
  title: string;
  href: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
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
      { title: 'Box', href: '/ui/box' },
      { title: 'Button', href: '/ui/button' },
    ],
  },
];
