// SSR scenarios for text.test.tsx.
import { Text } from '.';

export const variants = () => (
  <div>
    <Text>Paragraph</Text>
    <Text size="xs" color="primary" weight="medium" class="mine">
      Small primary
    </Text>
    <Text dimmed truncate>
      Dimmed and truncated
    </Text>
    <Text as="span" lineClamp={2} style={{ color: 'red' }}>
      Inline, clamped
    </Text>
    <Text as="label" inherit for="x">
      Label
    </Text>
  </div>
);
