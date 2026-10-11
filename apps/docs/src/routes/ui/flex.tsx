import { Title } from '@solidjs/meta';
import { CodeBlock } from '../../components/CodeBlock';
import { Example } from '../../components/Example';
import { H2 } from '../../components/Heading';

import Basic from '../../examples/flex/basic';
import basicCode from '../../examples/flex/basic.tsx?raw';
import Display from '../../examples/flex/display';
import displayCode from '../../examples/flex/display.tsx?raw';

export default function FlexPage() {
  return (
    <article class="docs-page">
      <Title>Flex · slopkit</Title>
      <p class="docs-eyebrow">UI</p>
      <h1>Flex</h1>
      <p class="docs-lead">
        A <code>div</code> that is a flex container. It only takes flex props and <code>display</code>; for spacing and size, use
        a <a href="/ui/box">Box</a>. Work in progress.
      </p>

      <H2 id="import">Import</H2>
      <CodeBlock code={`import { Flex } from '@solid-slopkit/ui';`} />

      <H2 id="flex-props">Flex props</H2>
      <p>
        <code>direction</code>, <code>wrap</code>, <code>align</code> (<code>align-items</code>), <code>justify</code> (
        <code>justify-content</code>), <code>gap</code>, <code>rowGap</code> and <code>columnGap</code>, all responsive. Gaps are
        in spacing units, and <code>rowGap</code> / <code>columnGap</code> win over <code>gap</code>.
      </p>
      <Example component={Basic} code={basicCode} column />

      <H2 id="display">Display</H2>
      <p>
        Flex is <code>display: flex</code> unless <code>display</code> says otherwise, for example <code>inline-flex</code> or
        hidden at some breakpoints.
      </p>
      <Example component={Display} code={displayCode} column />
    </article>
  );
}
