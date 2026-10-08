import { Box } from '@slopkit/ui';

export default function Style() {
  return (
    <>
      <Box style={{ padding: '1rem', border: '1px dashed currentColor' }}>Style as an object</Box>
      <Box style="padding: 1rem; border: 1px dashed currentColor">Style as a string</Box>
    </>
  );
}
