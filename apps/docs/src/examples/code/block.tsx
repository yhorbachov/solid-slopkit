import { Code } from '@solid-slopkit/ui';

const source = `import { Code } from '@solid-slopkit/ui';

export function Snippet() {
  return <Code block>{'const answer = 42;'}</Code>;
}`;

export default function Block() {
  return (
    <Code block style={{ width: '100%' }}>
      {source}
    </Code>
  );
}
