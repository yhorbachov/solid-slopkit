import { createSignal, Show } from 'solid-js';
import { Alert, Button, Group } from '@solid-slopkit/ui';

export default function Dismiss() {
  const [open, setOpen] = createSignal(true);

  return (
    <Show
      when={open()}
      fallback={
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
          Show the alert again
        </Button>
      }
    >
      <Alert color="warning" title="Unsaved changes" style={{ width: '100%' }}>
        <Group justify="space-between" wrap="nowrap" gap={3}>
          <span>You have changes that aren't saved yet.</span>
          <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
            Dismiss
          </Button>
        </Group>
      </Alert>
    </Show>
  );
}
