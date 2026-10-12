import { Code, CopyButton, Group } from '@solid-slopkit/ui';

export default function Basic() {
  return (
    <Group gap={2}>
      <Code>npm i @solid-slopkit/ui</Code>
      <CopyButton value="npm i @solid-slopkit/ui" size="sm" label="Copy the install command" />
    </Group>
  );
}
