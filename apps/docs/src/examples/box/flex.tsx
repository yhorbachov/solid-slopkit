import { Box } from '@slopkit/ui';

const surface = { background: 'var(--slp-color-base-200)' };
const item = { background: 'var(--slp-color-base-300)' };

export default function Flex() {
  return (
    <>
      <Box gap={2} p={2} style={surface}>
        <Box p={2} style={item}>
          {'gap={2}'}
        </Box>
        <Box p={2} style={item}>
          b
        </Box>
        <Box p={2} style={item}>
          c
        </Box>
      </Box>
      <Box justify="space-between" align="center" h={20} p={2} style={surface}>
        <Box p={2} style={item}>
          {'justify="space-between" align="center"'}
        </Box>
        <Box p={4} style={item}>
          taller
        </Box>
      </Box>
      <Box direction={{ base: 'column', sm: 'row' }} gap={2} p={2} style={surface}>
        <Box p={2} style={item}>
          {"direction={{ base: 'column', sm: 'row' }}"}
        </Box>
        <Box p={2} style={item}>
          b
        </Box>
      </Box>
      <Box wrap="wrap" gap={2} rowGap={4} p={2} style={{ ...surface, width: '20rem' }}>
        {['wrap="wrap"', 'gap={2}', 'rowGap={4}', 'd', 'e', 'f'].map((label) => (
          <Box p={2} w={24} style={item}>
            {label}
          </Box>
        ))}
      </Box>
    </>
  );
}
