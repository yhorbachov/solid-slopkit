import { Title } from '@solidjs/meta';
import { CodeBlock } from '../../components/CodeBlock';
import { Example } from '../../components/Example';
import { H2 } from '../../components/Heading';
import { PropsTable } from '../../components/PropsTable';

import Vertical from '../../examples/space/vertical';
import verticalCode from '../../examples/space/vertical.tsx?raw';
import Horizontal from '../../examples/space/horizontal';
import horizontalCode from '../../examples/space/horizontal.tsx?raw';

export default function SpacePage() {
  return (
    <article class="docs-page">
      <Title>Space · slopkit</Title>
      <p class="docs-eyebrow">UI</p>
      <h1>Space</h1>
      <p class="docs-lead">
        Empty space between elements, for one-off gaps where a margin or a <a href="/ui/stack">Stack</a> would be awkward.
      </p>

      <H2 id="import">Import</H2>
      <CodeBlock code={`import { Space } from '@solid-slopkit/ui';`} />

      <H2 id="vertical">Vertical</H2>
      <p>
        <code>h</code> adds space between blocks. Like Box, sizes are spacing units, or any CSS length.
      </p>
      <Example component={Vertical} code={verticalCode} column />

      <H2 id="horizontal">Horizontal</H2>
      <p>
        <code>w</code> adds space in a row. Space never shrinks in a flex container. Both props take a value per breakpoint.
      </p>
      <Example component={Horizontal} code={horizontalCode} column />

      <H2 id="props">Props</H2>
      <p>Other props are passed to the rendered div.</p>
      <PropsTable
        rows={[
          { name: 'h', type: 'ResponsiveValue<number | string>', description: 'Height: spacing units or a CSS length.' },
          { name: 'w', type: 'ResponsiveValue<number | string>', description: 'Width: spacing units or a CSS length.' },
        ]}
      />
    </article>
  );
}
