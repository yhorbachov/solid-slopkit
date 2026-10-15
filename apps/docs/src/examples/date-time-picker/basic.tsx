import { createSignal } from 'solid-js';
import { Stack, Text } from '@solid-slopkit/ui';
import { DateTimePicker } from '@solid-slopkit/ui/dates';

export default function Basic() {
  const [when, setWhen] = createSignal<Date | null>(new Date(2026, 9, 15, 9, 30));

  return (
    <Stack style={{ 'max-width': '20rem' }}>
      <DateTimePicker label="Meeting" placeholder="Pick a date and time" value={when()} onChange={setWhen} clearable />
      <Text size="sm">{when() ? when()!.toString() : 'Nothing chosen'}</Text>
    </Stack>
  );
}
