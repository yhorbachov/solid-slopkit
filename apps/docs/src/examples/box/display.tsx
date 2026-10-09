import { Box } from '@slopkit/ui';

const surface = { background: 'var(--slp-color-base-200)' };
const item = { background: 'var(--slp-color-base-300)' };

export default function Display() {
  return (
    <>
      <Box display={{ base: 'none', sm: 'block' }} p={2} style={surface}>
        {"display={{ base: 'none', sm: 'block' }}: hidden below sm"}
      </Box>
      <Box display={{ base: 'block', sm: 'none' }} p={2} style={surface}>
        {"display={{ base: 'block', sm: 'none' }}: only below sm"}
      </Box>
      <Box display="grid" gap={2} p={2} style={{ ...surface, 'grid-template-columns': 'repeat(3, 1fr)' }}>
        <Box p={2} style={item}>
          {'display="grid" gap={2}'}
        </Box>
        <Box p={2} style={item}>
          b
        </Box>
        <Box p={2} style={item}>
          c
        </Box>
      </Box>
      {/* In a plain block: as a child of the flex preview, inline-flex would be blockified to flex. */}
      <div>
        <Box display="inline-flex" gap={2} p={2} style={surface}>
          <Box p={2} style={item}>
            {'display="inline-flex" gap={2}'}
          </Box>
          <Box p={2} style={item}>
            b
          </Box>
        </Box>
        <span> next to inline text</span>
      </div>
    </>
  );
}
