import { Title } from '@solidjs/meta';
import { CodeBlock } from '../../components/CodeBlock';
import { Example } from '../../components/Example';
import { H2 } from '../../components/Heading';
import { PropsTable } from '../../components/PropsTable';

import Basic from '../../examples/stack/basic';
import basicCode from '../../examples/stack/basic.tsx?raw';

export default function StackPage() {
  return (
    <article class="docs-page">
      <Title>Stack · slopkit</Title>
      <p class="docs-eyebrow">UI</p>
      <h1>Stack</h1>
      <p class="docs-lead">
        Stacks children vertically: a column <a href="/ui/flex">Flex</a> with a gap. Its props are not responsive; for a layout
        that changes per breakpoint, use Flex.
      </p>

      <H2 id="import">Import</H2>
      <CodeBlock code={`import { Stack } from '@solid-slopkit/ui';`} />

      <H2 id="usage">Usage</H2>
      <Example component={Basic} code={basicCode} column />

      <H2 id="props">Props</H2>
      <p>Other props are passed to the rendered div.</p>
      <PropsTable
        rows={[
          { name: 'gap', type: 'number', default: '4', description: 'Space between children, in spacing units.' },
          { name: 'align', type: 'FlexAlign', default: "'stretch'", description: <code>align-items</code> },
          { name: 'justify', type: 'FlexJustify', default: "'flex-start'", description: <code>justify-content</code> },
        ]}
      />
    </article>
  );
}
