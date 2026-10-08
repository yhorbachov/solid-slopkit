import { Box } from '@slopkit/ui';

export default function Polymorphic() {
  return (
    <>
      <Box as="section">Rendered as a section</Box>
      <Box as="a" href="/ui/button">
        Rendered as a link
      </Box>
    </>
  );
}
