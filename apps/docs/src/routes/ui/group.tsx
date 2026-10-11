import { Title } from '@solidjs/meta';
import { CodeBlock } from '../../components/CodeBlock';
import { Example } from '../../components/Example';
import { H2 } from '../../components/Heading';
import { PropsTable } from '../../components/PropsTable';

import Basic from '../../examples/group/basic';
import basicCode from '../../examples/group/basic.tsx?raw';
import Grow from '../../examples/group/grow';
import growCode from '../../examples/group/grow.tsx?raw';

export default function GroupPage() {
  return (
    <article class="docs-page">
      <Title>Group · slopkit</Title>
      <p class="docs-eyebrow">UI</p>
      <h1>Group</h1>
      <p class="docs-lead">
        Lays children out in a row: a <a href="/ui/flex">Flex</a> with a gap that wraps and centers its children vertically. Its
        props are not responsive; for a layout that changes per breakpoint, use Flex.
      </p>

      <H2 id="import">Import</H2>
      <CodeBlock code={`import { Group } from '@solid-slopkit/ui';`} />

      <H2 id="usage">Usage</H2>
      <Example component={Basic} code={basicCode} column />

      <H2 id="grow">Grow</H2>
      <p>
        <code>grow</code> makes children fill the row. By default they share it equally and their content cannot widen them; set{' '}
        <code>preventGrowOverflow={'{false}'}</code> to let wider content take more.
      </p>
      <Example component={Grow} code={growCode} column />

      <H2 id="props">Props</H2>
      <p>Other props are passed to the rendered div.</p>
      <PropsTable
        rows={[
          { name: 'gap', type: 'number', default: '4', description: 'Space between children, in spacing units.' },
          { name: 'align', type: 'FlexAlign', default: "'center'", description: <code>align-items</code> },
          { name: 'justify', type: 'FlexJustify', default: "'flex-start'", description: <code>justify-content</code> },
          { name: 'wrap', type: 'FlexWrap', default: "'wrap'", description: <code>flex-wrap</code> },
          { name: 'grow', type: 'boolean', default: 'false', description: 'Children grow to fill the row.' },
          {
            name: 'preventGrowOverflow',
            type: 'boolean',
            default: 'true',
            description: 'With grow, children share the row equally and their content cannot widen them.',
          },
        ]}
      />
    </article>
  );
}
