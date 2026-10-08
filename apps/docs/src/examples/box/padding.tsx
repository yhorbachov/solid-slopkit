import { Box } from '@slopkit/ui';

const surface = { background: 'var(--slp-color-base-200)' };

export default function Padding() {
  return (
    <>
      <Box p="md" style={surface}>
        p="md"
      </Box>
      <Box px="xl" py="xs" style={surface}>
        px="xl" py="xs"
      </Box>
      <Box p="xs" pl="xl" style={surface}>
        p="xs" pl="xl"
      </Box>
      <Box pt="lg" style={surface}>
        pt="lg"
      </Box>
    </>
  );
}
