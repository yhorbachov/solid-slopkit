import { createSignal, createUniqueId } from 'solid-js';
import { Button, Collapse, Stack, Text } from '@solid-slopkit/ui';

export default function Basic() {
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
        {expanded() ? 'Hide' : 'Show'} shipping details
      </Button>
      <Collapse id={id} expanded={expanded()}>
        <Text>
          Orders placed before 2 p.m. leave the warehouse the same day. Standard delivery takes two to four working days, and you
          get a tracking link by email as soon as the parcel is on its way.
        </Text>
      </Collapse>
    </Stack>
  );
}
