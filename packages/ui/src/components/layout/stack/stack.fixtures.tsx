// SSR scenarios for stack.test.tsx.
import { Stack } from '.';

export const defaultsAndProps = () => (
  <Stack class="mine">
    <Stack gap={2} align="center" justify="space-between">
      <span>a</span>
      <span>b</span>
    </Stack>
    <span>c</span>
    <Stack divided gap={3} style={{ color: 'red' }}>
      <span>d</span>
      <span>e</span>
    </Stack>
  </Stack>
);
