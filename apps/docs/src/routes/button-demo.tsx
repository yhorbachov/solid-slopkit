import { Button } from '@slopkit/ui';
import { Minus, Plus } from '@lucide/solid';

export default function ButtonDemo() {
  return (
    <>
      <Button size="xl" leftSection={<Minus />} rightSection={<Plus />}>
        XL With Icons
      </Button>

      <Button leftSection={<Minus />} rightSection={<Plus />}>
        MD With Icons
      </Button>

      <Button loading leftSection={<Minus />} rightSection={<Plus />}>
        Loading
      </Button>

      <Button>Without icons</Button>
    </>
  );
}
