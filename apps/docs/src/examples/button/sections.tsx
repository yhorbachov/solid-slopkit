import { Button } from '@slopkit/ui';
import { ArrowRight, Download } from '@lucide/solid';

export default function Sections() {
  return (
    <>
      <Button leftSection={<Download />}>Download</Button>
      <Button color="primary" rightSection={<ArrowRight />}>
        Continue
      </Button>
      <Button variant="outline" leftSection={<Download />} rightSection={<ArrowRight />}>
        Both
      </Button>
    </>
  );
}
