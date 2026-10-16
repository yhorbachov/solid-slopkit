import { For } from 'solid-js';
import { Group, Stack, Text } from '@solid-slopkit/ui';

const ROWS = [
  ['Net royalties', '$1,240.00'],
  ['Processing fee', '-$24.80'],
  ['Ready to claim', '$1,215.20'],
];

export default function Divided() {
  return (
    <Stack divided gap={5} style={{ width: '18rem' }}>
      <For each={ROWS}>
        {([label, value]) => (
          <Group justify="space-between">
            <Text size="sm" dimmed>
              {label}
            </Text>
            <Text size="sm" weight="medium">
              {value}
            </Text>
          </Group>
        )}
      </For>
    </Stack>
  );
}
