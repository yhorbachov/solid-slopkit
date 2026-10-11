import { Box } from '@solid-slopkit/ui';

export default function Style() {
  return (
    <>
      <Box style={{ padding: '1rem', border: '1px dashed currentColor' }}>Style as an object</Box>
      {/* oxlint-disable-next-line solid/style-prop -- this example shows that a string style works too */}
      <Box style="padding: 1rem; border: 1px dashed currentColor">Style as a string</Box>
    </>
  );
}
