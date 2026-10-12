import { Alert } from '@solid-slopkit/ui';
import { Info } from '@lucide/solid';

export default function Basic() {
  return (
    <Alert title="The default theme is a work in progress" icon={<Info aria-hidden="true" />} role="note">
      Components read only tokens, so they follow whatever the theme ends up being.
    </Alert>
  );
}
