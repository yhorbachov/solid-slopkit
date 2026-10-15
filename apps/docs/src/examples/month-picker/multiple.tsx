import { createSignal } from 'solid-js';
import { Stack, Text } from '@solid-slopkit/ui';
import { MonthPicker, createDay, useFormatDate } from '@solid-slopkit/ui/dates';

export default function Multiple() {
  const [months, setMonths] = createSignal([createDay(2026, 2, 1), createDay(2026, 5, 1)]);
  const format = useFormatDate();

  return (
    <Stack align="center">
      <MonthPicker type="multiple" value={months()} onChange={setMonths} color="secondary" />
      <Text size="sm">
        {months()
          .map((month) => format(month, { month: 'short', year: 'numeric' }))
          .join(', ') || 'No months chosen'}
      </Text>
    </Stack>
  );
}
