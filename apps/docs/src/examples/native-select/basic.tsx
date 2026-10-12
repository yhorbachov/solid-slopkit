import { NativeSelect } from '@solid-slopkit/ui';

export default function Basic() {
  return (
    <NativeSelect
      label="Framework"
      description="The one you build with most."
      data={['Solid', 'Svelte', { value: 'other', label: 'Something else' }]}
      style={{ width: '100%', 'max-width': '20rem' }}
    />
  );
}
