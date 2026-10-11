import { SegmentedControl } from '@solid-slopkit/ui';

export default function Basic() {
  return <SegmentedControl aria-label="Framework" data={['React', 'Solid', 'Vue', 'Svelte']} />;
}
