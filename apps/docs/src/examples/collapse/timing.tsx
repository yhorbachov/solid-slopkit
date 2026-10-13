import { createSignal, createUniqueId } from 'solid-js';
import { Button, Collapse, Paper, Stack, Text } from '@solid-slopkit/ui';

export default function Timing() {
  const [expanded, setExpanded] = createSignal(false);
  const id = createUniqueId();

  return (
    <Stack align="flex-start">
      <Button
        variant="outline"
        aria-expanded={expanded() ? 'true' : 'false'}
        aria-controls={id}
        onClick={() => setExpanded((value) => !value)}
      >
        Toggle
      </Button>
      <Collapse
        id={id}
        expanded={expanded()}
        duration={600}
        timingFunction="cubic-bezier(0.2, 0.8, 0.2, 1)"
        animateOpacity={false}
      >
        <Paper withBorder>
          <Text>A slower, eased animation that only changes the height.</Text>
        </Paper>
      </Collapse>
    </Stack>
  );
}
