import { Box, SimpleGrid } from '@slopkit/ui';

const surface = { background: 'var(--slp-color-base-200)', padding: '0.5rem' };
const item = { background: 'var(--slp-color-base-300)' };

export default function Basic() {
  return (
    <SimpleGrid cols={3} style={surface}>
      {['cols={3}', 'b', 'c', 'd', 'e'].map((label) => (
        <Box p={2} style={item}>
          {label}
        </Box>
      ))}
    </SimpleGrid>
  );
}
