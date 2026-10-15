import { createSignal } from 'solid-js';
import { Stack, Text } from '@solid-slopkit/ui';
import { MonthPicker, createDay, useFormatDate } from '@solid-slopkit/ui/dates';

export default function Range() {
  const [range, setRange] = createSignal<[Date | null, Date | null]>([createDay(2026, 9, 1), createDay(2027, 2, 1)]);
  const format = useFormatDate();
  const label = (month: Date | null) => (month ? format(month, { month: 'short', year: 'numeric' }) : '…');

  return (
    <Stack align="center">
      <MonthPicker
        type="range"
        numberOfColumns={2}
        value={range()}
        onChange={setRange}
        minDate={createDay(2026, 3, 1)}
        maxLevel="year"
      />
      <Text size="sm">
        {label(range()[0])} – {label(range()[1])}
      </Text>
    </Stack>
  );
}
