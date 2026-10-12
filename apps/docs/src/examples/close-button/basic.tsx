import { CloseButton, Group } from '@solid-slopkit/ui';

export default function Basic() {
  return (
    <Group>
      <CloseButton />
      <CloseButton color="error" label="Delete" />
      <CloseButton disabled />
    </Group>
  );
}
