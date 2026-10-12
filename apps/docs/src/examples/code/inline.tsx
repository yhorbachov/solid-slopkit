import { Code, Text } from '@solid-slopkit/ui';

export default function Inline() {
  return (
    <Text>
      Run <Code>pnpm install</Code>, then start the docs with <Code>pnpm dev</Code>.
    </Text>
  );
}
