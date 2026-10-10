import { SegmentedControl } from '@slopkit/ui';

export default function Sizes() {
  return (
    <>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <SegmentedControl aria-label={`Size ${size}`} size={size} data={[size, 'Two', 'Three']} />
      ))}
    </>
  );
}
