import { Box, Group } from '@slopkit/ui';

const surface = { background: 'var(--slp-color-base-200)', padding: '0.5rem' };
const item = { background: 'var(--slp-color-base-300)' };

export default function Basic() {
  return (
    <>
      <Group style={surface}>
        <Box p={2} style={item}>
          {'<Group>'}
        </Box>
        <Box p={4} style={item}>
          taller
        </Box>
        <Box p={2} style={item}>
          c
        </Box>
      </Group>
      <Group gap={2} justify="space-between" style={surface}>
        <Box p={2} style={item}>
          {'gap={2} justify="space-between"'}
        </Box>
        <Box p={2} style={item}>
          b
        </Box>
      </Group>
      <Group gap={2} style={{ ...surface, width: '20rem' }}>
        {['wraps by default', 'b', 'c', 'd', 'e', 'f'].map((label) => (
          <Box p={2} w={24} style={item}>
            {label}
          </Box>
        ))}
      </Group>
    </>
  );
}
