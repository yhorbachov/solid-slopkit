import { SegmentedControl } from '@solid-slopkit/ui';

export default function Basic() {
  return <SegmentedControl aria-label="Theme" data={['Light', 'Dark', 'System']} />;
}
