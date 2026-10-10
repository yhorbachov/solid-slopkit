import { Container, Stack } from '@slopkit/ui';

const content = { background: 'var(--slp-color-base-300)', padding: '0.5rem' };

export default function Sizes() {
  return (
    <Stack gap={2} style={{ width: '100%', background: 'var(--slp-color-base-200)', 'padding-block': '0.5rem' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Container size={size}>
          <div style={content}>size="{size}"</div>
        </Container>
      ))}
      <Container size="30rem">
        <div style={content}>size="30rem"</div>
      </Container>
    </Stack>
  );
}
