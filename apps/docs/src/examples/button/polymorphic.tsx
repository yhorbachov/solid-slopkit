import { Button } from '@solid-slopkit/ui';
import { ArrowRight } from '@lucide/solid';

export default function Polymorphic() {
  return (
    <>
      <Button as="a" href="/ui/theming" rightSection={<ArrowRight />}>
        Link styled as a button
      </Button>
      <Button as="div" color="primary" variant="soft">
        Div with button role
      </Button>
    </>
  );
}
