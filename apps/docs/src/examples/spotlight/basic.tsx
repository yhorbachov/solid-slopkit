import { CreditCard, FileText, House, Search, User } from '@lucide/solid';
import { Button, Group, Kbd, Spotlight, Text, useNotifications, useSpotlight, type SpotlightActions } from '@solid-slopkit/ui';

export default function Basic() {
  const search = useSpotlight();
  const notifications = useNotifications();
  const go = (page: string) => () => notifications.show({ message: `Opened ${page}` });

  // Made in the body, before the spotlight renders: the icons are functions, called when an action is shown.
  const actions: SpotlightActions = [
    { id: 'home', label: 'Home', description: 'The start page', leftSection: () => <House />, onTrigger: go('Home') },
    {
      id: 'docs',
      label: 'Documentation',
      description: 'Guides and references',
      keywords: ['help', 'manual'],
      leftSection: () => <FileText />,
      onTrigger: go('Documentation'),
    },
    {
      group: 'Settings',
      actions: [
        { id: 'profile', label: 'Profile', keywords: ['account', 'name'], leftSection: () => <User />, onTrigger: go('Profile') },
        {
          id: 'billing',
          label: 'Billing',
          description: 'Ask an admin for access',
          leftSection: () => <CreditCard />,
          disabled: true,
        },
      ],
    },
  ];

  return (
    <Group>
      <Button variant="outline" leftSection={<Search />} onClick={() => search.open()}>
        Search
      </Button>
      <Text size="sm">
        or press <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> (<Kbd>⌘</Kbd> <Kbd>K</Kbd> on a Mac)
      </Text>
      <Spotlight actions={actions} highlightQuery />
    </Group>
  );
}
