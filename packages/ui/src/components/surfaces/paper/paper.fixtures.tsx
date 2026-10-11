// SSR scenarios for paper.test.tsx.
import { Paper } from '.';

export const variants = () => (
  <div>
    <Paper>Default</Paper>
    <Paper shadow="md" withBorder radius="field" class="mine">
      Shadow and border
    </Paper>
    <Paper surface="base-200" padding="xl">
      <Paper surface="base-100" padding="sm" radius="selector">
        Nested
      </Paper>
    </Paper>
  </div>
);
