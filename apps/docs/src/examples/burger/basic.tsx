import { Burger, Group } from '@solid-slopkit/ui';

export default function Basic() {
  return (
    <Group>
      <Burger />
      <Burger defaultOpened label="Menu" />
    </Group>
  );
}
