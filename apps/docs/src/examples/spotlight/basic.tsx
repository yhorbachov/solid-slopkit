import { createSignal } from 'solid-js';
import { Button, Kbd, Spotlight, Stack, Text, type SpotlightAction } from '@solid-slopkit/ui';

export default function Basic() {
  const [opened, setOpened] = createSignal(false);
  const [last, setLast] = createSignal('None');
  const actions: SpotlightAction[] = [
    { id: 'home', label: 'Home', description: 'Open the overview', keywords: ['start'], group: 'Pages', leftSection: '⌂' },
    { id: 'settings', label: 'Settings', description: 'Manage preferences', group: 'Pages', leftSection: '⚙' },
    { id: 'save', label: 'Save project', group: 'Commands', rightSection: () => <Kbd>↵</Kbd> },
    { id: 'archive', label: 'Archive project', group: 'Commands', disabled: true },
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
