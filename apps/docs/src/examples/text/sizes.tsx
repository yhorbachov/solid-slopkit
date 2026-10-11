import { For } from 'solid-js';
import { Stack, Text } from '@solid-slopkit/ui';

export default function Sizes() {
  return (
    <Stack gap={1}>
      <For each={['xs', 'sm', 'md', 'lg', 'xl'] as const}>{(size) => <Text size={size}>{`size="${size}"`}</Text>}</For>
    </Stack>
  );
}
