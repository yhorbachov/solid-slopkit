import { Avatar } from '@solid-slopkit/ui';

export default function Group() {
  return (
    <Avatar.Group role="group" aria-label="Reviewers">
      <Avatar src="/example-landscape.svg" name="Sunset Hills" />
      <Avatar name="Grace Hopper" color="primary" />
      <Avatar name="Alan Turing" color="success" />
      <Avatar name="Edsger Dijkstra" color="warning" />
      <Avatar alt="4 more reviewers" variant="solid" color="neutral">
        +4
      </Avatar>
    </Avatar.Group>
  );
}
