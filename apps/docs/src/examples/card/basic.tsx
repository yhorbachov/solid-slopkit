import { Button, Card, Text, Title } from '@solid-slopkit/ui';

export default function Basic() {
  return (
    <Card style={{ width: '20rem' }}>
      <Card.Image src="/example-landscape.svg" alt="Mountains at sunset" style={{ height: '10rem' }} />
      <Card.Header>
        <Title order={3} size="h5">
          Norway
        </Title>
        <Text as="span" size="xs" color="success" weight="semibold">
          New
        </Text>
      </Card.Header>
      <Card.Body>
        <Text size="sm" dimmed>
          Fjords, mountains and the midnight sun, on a ten-day trip along the coast.
        </Text>
      </Card.Body>
      <Card.Footer>
        <Button variant="ghost" size="sm">
          Details
        </Button>
        <Button color="primary" size="sm">
          Book
        </Button>
      </Card.Footer>
    </Card>
  );
}
