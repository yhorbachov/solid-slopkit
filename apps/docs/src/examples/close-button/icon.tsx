import { Eraser } from '@lucide/solid';
import { CloseButton } from '@solid-slopkit/ui';

export default function Icon() {
  return (
    <CloseButton label="Clear search">
      <Eraser aria-hidden="true" />
    </CloseButton>
  );
}
