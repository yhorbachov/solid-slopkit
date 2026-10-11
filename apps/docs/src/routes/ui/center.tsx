import { Title } from '@solidjs/meta';
import { CodeBlock } from '../../components/CodeBlock';
import { Example } from '../../components/Example';
import { H2 } from '../../components/Heading';
import { PropsTable } from '../../components/PropsTable';

import Basic from '../../examples/center/basic';
import basicCode from '../../examples/center/basic.tsx?raw';
import Inline from '../../examples/center/inline';
import inlineCode from '../../examples/center/inline.tsx?raw';

export default function CenterPage() {
  return (
    <article class="docs-page">
      <Title>Center · slopkit</Title>
      <p class="docs-eyebrow">UI</p>
      <h1>Center</h1>
      <p class="docs-lead">
        Centers its content horizontally and vertically: a <a href="/ui/flex">Flex</a> with <code>align</code> and{' '}
        <code>justify</code> set to <code>center</code>.
      </p>

      <H2 id="import">Import</H2>
      <CodeBlock code={`import { Center } from '@solid-slopkit/ui';`} />

      <H2 id="usage">Usage</H2>
      <Example component={Basic} code={basicCode} column />

      <H2 id="inline">Inline</H2>
      <p>
        <code>inline</code> makes it <code>inline-flex</code>, for centering an icon or a badge inside a line of text.
      </p>
      <Example component={Inline} code={inlineCode} column />

      <H2 id="props">Props</H2>
      <p>Other props are passed to the rendered div.</p>
      <PropsTable
        rows={[
          {
            name: 'inline',
            type: 'boolean',
            default: 'false',
            description: (
              <>
                Uses <code>inline-flex</code>.
              </>
            ),
          },
        ]}
      />
    </article>
  );
}
