import { createSignal } from 'solid-js';
import { Archive, House, Save, Settings } from '@lucide/solid';
import { Button, Kbd, Spotlight, Stack, Text, type SpotlightAction } from '@solid-slopkit/ui';

export default function Basic() {
  const [opened, setOpened] = createSignal(false);
  const [last, setLast] = createSignal('None');
  const actions: SpotlightAction[] = [
    {
      id: 'home',
      label: 'Home',
      description: 'Open the overview',
      keywords: ['start'],
      group: 'Pages',
      leftSection: () => <House size={16} />,
    },
    {
      id: 'settings',
      label: 'Settings',
      description: 'Manage preferences',
      group: 'Pages',
      leftSection: () => <Settings size={16} />,
    },
    {
      id: 'save',
      label: 'Save project',
      group: 'Commands',
      leftSection: () => <Save size={16} />,
      rightSection: () => <Kbd>↵</Kbd>,
    },
    { id: 'archive', label: 'Archive project', group: 'Commands', leftSection: () => <Archive size={16} />, disabled: true },
  ];
  return (
    <Stack>
      <Button onClick={() => setOpened(true)}>Search actions</Button>
      <Text>Last action: {last()}</Text>
      <Spotlight
        opened={opened()}
        onClose={() => setOpened(false)}
        title="Commands"
        actions={actions}
        onActionTrigger={(action) => setLast(action.label)}
      />
    </Stack>
  );
}
