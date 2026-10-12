import { Button, Card, Text, Title } from '@solid-slopkit/ui';

export default function Horizontal() {
  return (
    <Card orientation="horizontal" style={{ 'max-width': '32rem' }}>
      <Card.Image src="/example-landscape.svg" alt="Mountains at sunset" />
      <Card.Header>
        <Title order={3} size="h5">
          Norway
        </Title>
      </Card.Header>
      <Card.Body>
        <Text size="sm" dimmed>
          The image fills a column on the start side, as tall as the parts beside it.
        </Text>
      </Card.Body>
      <Card.Footer>
        <Button color="primary" size="sm">
          Book
        </Button>
      </Card.Footer>
    </Card>
  );
}
