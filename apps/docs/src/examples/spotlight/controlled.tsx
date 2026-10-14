import { createSignal } from 'solid-js';
import { Button, Spotlight, Stack, Text } from '@solid-slopkit/ui';

export default function Controlled() {
  const [opened, setOpened] = createSignal(false);
  const [query, setQuery] = createSignal('');
  const [count, setCount] = createSignal(0);
  return (
    <Stack>
      <Button
        onClick={() => {
          setQuery('');
          setOpened(true);
        }}
      >
        Open repeatable commands
      </Button>
      <Text>Created {count()} drafts</Text>
      <Spotlight
        opened={opened()}
        onClose={() => setOpened(false)}
        title="Draft commands"
        query={query()}
        onQueryChange={setQuery}
        closeOnActionTrigger={false}
        limit={5}
        actions={[
          {
            id: 'create',
            label: 'Create draft',
            description: 'Run repeatedly without closing',
            onTrigger: () => setCount(count() + 1),
          },
        ]}
      />
    </Stack>
  );
}
