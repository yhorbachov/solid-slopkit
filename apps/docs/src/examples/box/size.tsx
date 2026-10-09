import { Box } from '@slopkit/ui';

const surface = { background: 'var(--slp-color-base-200)' };

export default function Size() {
  return (
    <>
      <Box w={24} h={16} p={2} style={surface}>
        {'w={24} h={16}'}
      </Box>
      <Box w="50%" p={2} style={surface}>
        {'w="50%"'}
      </Box>
      <Box w={{ base: '100%', sm: 64 }} p={2} style={surface}>
        {"w={{ base: '100%', sm: 64 }}"}
      </Box>
    </>
  );
}
