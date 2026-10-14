import { createSignal } from 'solid-js';
import { Select, Stack, Text } from '@solid-slopkit/ui';

export default function Searchable() {
  const [city, setCity] = createSignal<string | null>('osl');

  return (
    <Stack style={{ width: '16rem' }}>
      <Select
        label="City"
        placeholder="Search for a city"
        searchable
        clearable
        nothingFoundMessage="No city matches"
        value={city()}
        onChange={(value) => setCity(value)}
        data={[
          {
            group: 'Nordics',
            items: [
              { value: 'cph', label: 'Copenhagen' },
              { value: 'osl', label: 'Oslo' },
              { value: 'sto', label: 'Stockholm' },
            ],
          },
          {
            group: 'Baltics',
            items: [
              { value: 'rix', label: 'Riga' },
              { value: 'tll', label: 'Tallinn', disabled: true },
              { value: 'vno', label: 'Vilnius' },
            ],
          },
        ]}
      />
      <Text size="sm">Value: {city() ?? 'none'}</Text>
    </Stack>
  );
}
