import { Box } from '@slopkit/ui';

export default function ResponsivePadding() {
  return (
    <div>
      <Box p={{ base: 'xs', sm: 'md', lg: 'xl' }} style={{ background: 'var(--slp-color-base-200)' }}>
        xs below sm, md from sm, xl from lg. Resize the window.
      </Box>

      <Box px={{ base: 'xs', xl: 'xl' }} style={{ background: 'var(--slp-color-base-200)' }}>
        xs below sm, md from sm, xl from lg. Resize the window.
      </Box>
    </div>
  );
}
