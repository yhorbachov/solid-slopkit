import { Title } from '@solidjs/meta';
import { CodeBlock } from '../../components/CodeBlock';
import { Example } from '../../components/Example';
import { H2 } from '../../components/Heading';
import { PropsTable } from '../../components/PropsTable';

import Basic from '../../examples/collapse/basic';
import basicCode from '../../examples/collapse/basic.tsx?raw';
import Timing from '../../examples/collapse/timing';
import timingCode from '../../examples/collapse/timing.tsx?raw';

export default function CollapsePage() {
  return (
    <article class="docs-page">
      <Title>Collapse · slopkit</Title>
      <p class="docs-eyebrow">UI</p>
      <h1>Collapse</h1>
      <p class="docs-lead">
        A <code>div</code> that animates its height between zero and its content's as <code>expanded</code> changes.
      </p>

      <H2 id="import">Import</H2>
      <CodeBlock code={`import { Collapse } from '@solid-slopkit/ui';`} />

      <H2 id="usage">Usage</H2>
      <p>
        Collapsed, it stays in the DOM with <code>display: none</code>: its content keeps its state, and is out of the tab order
        and hidden from screen readers. The button that toggles it is yours: give it <code>aria-expanded</code>, and{' '}
        <code>aria-controls</code> with the Collapse's <code>id</code>.
      </p>
      <Example component={Basic} code={basicCode} />

      <H2 id="timing">Timing</H2>
      <p>
        <code>duration</code> sets the animation in milliseconds, 200 by default, and <code>timingFunction</code> its easing. The
        content fades with the height unless <code>animateOpacity</code> is off. Under <code>prefers-reduced-motion: reduce</code>
        , it expands and collapses at once.
      </p>
      <Example component={Timing} code={timingCode} />

      <H2 id="layout">Layout</H2>
      <p>
        The Collapse's own height is what animates, so put padding, borders and margins on the content inside it, not on the
        Collapse. It contains its content's margins, so they don't collapse through it. Once expanded, its height follows the
        content again, so content that grows isn't cut off. Changing <code>expanded</code> midway reverses from where it is.
      </p>
      <p>
        In a Stack or another column flexbox, the parent's gap next to it shrinks along with the height, so nothing jumps when
        it's hidden or shown. A grid can't do that, since its rows can't shrink below zero: there, the gap goes when it's hidden.
      </p>

      <H2 id="props">Props</H2>
      <p>
        Other props, such as <code>id</code>, are passed to the <code>div</code>.
      </p>
      <PropsTable
        rows={[
          { name: 'expanded', type: 'boolean', description: 'Whether the content is shown.' },
          { name: 'duration', type: 'number', default: '200', description: 'Duration of the animation, in milliseconds.' },
          { name: 'timingFunction', type: 'string', default: "'ease'", description: 'CSS timing function of the animation.' },
          { name: 'animateOpacity', type: 'boolean', default: 'true', description: 'Whether the content also fades.' },
          { name: 'onExpanded', type: '() => void', description: 'Called when it has finished expanding.' },
          { name: 'onCollapsed', type: '() => void', description: 'Called when it has finished collapsing.' },
        ]}
      />

      <H2 id="styling">Styling</H2>
      <p>
        The root has the class <code>.slp-collapse</code>, with <code>data-status</code> (<code>starting</code>, <code>open</code>
        , <code>ending</code>, <code>closed</code>) and <code>data-animate-opacity</code>. Its rules live in{' '}
        <code>@layer slopkit.components</code>, so unlayered CSS wins.
      </p>
    </article>
  );
}
