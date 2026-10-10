import { SegmentedControl } from '@slopkit/ui';

export default function Layout() {
  return (
    <>
      <SegmentedControl aria-label="Full width" fullWidth data={['fullWidth', 'B', 'C']} />
      <SegmentedControl aria-label="Vertical" orientation="vertical" data={['Vertical', 'Two', 'Three']} />
    </>
  );
}
