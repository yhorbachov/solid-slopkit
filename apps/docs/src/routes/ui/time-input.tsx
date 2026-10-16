import { Title } from '@solidjs/meta';
import { CodeBlock } from '../../components/CodeBlock';
import { Example } from '../../components/Example';
import { H2 } from '../../components/Heading';
import { PropsTable } from '../../components/PropsTable';

import Basic from '../../examples/time-input/basic';
import basicCode from '../../examples/time-input/basic.tsx?raw';
import Seconds from '../../examples/time-input/seconds';
import secondsCode from '../../examples/time-input/seconds.tsx?raw';

export default function TimeInputPage() {
  return (
    <article class="docs-page">
      <Title>TimeInput · slopkit</Title>
      <p class="docs-eyebrow">UI</p>
      <h1>TimeInput</h1>
      <p class="docs-lead">A labelled field for a time of day: the browser's time input, in a field box.</p>

      <H2 id="import">Import</H2>
      <CodeBlock code={`import { TimeInput } from '@solid-slopkit/ui/dates';`} />

      <H2 id="usage">Usage</H2>
      <p>
        The value is <code>HH:mm</code> in 24 hours, <code>''</code> while the time is incomplete. The browser writes it by the
        user's settings, lets each part be typed or stepped with the arrow keys, and may offer its own picker; for a time written
        in the provider's locale, use <a href="/ui/time-picker">TimePicker</a>. <code>minTime</code> and <code>maxTime</code> make
        a time outside them invalid.
      </p>
      <Example component={Basic} code={basicCode} />

      <H2 id="seconds">Seconds</H2>
      <p>
        <code>withSeconds</code> adds them, and the value becomes <code>HH:mm:ss</code>.
      </p>
      <Example component={Seconds} code={secondsCode} />

      <H2 id="props">Props</H2>
      <p>
        Other props go to the <code>input</code>, and <code>label</code>, <code>labelSection</code>, <code>description</code>,{' '}
        <code>error</code>, <code>required</code>, <code>withAsterisk</code>, <code>size</code> and <code>id</code> work as on{' '}
        <a href="/ui/text-input">TextInput</a>.
      </p>
      <PropsTable
        rows={[
          { name: 'value', type: 'string', description: 'The time, when controlled: HH:mm or HH:mm:ss.' },
          { name: 'defaultValue', type: 'string', default: "''", description: 'The time at first, when uncontrolled.' },
          { name: 'onChange', type: '(value: string) => void', description: 'Called with the time on each change.' },
          { name: 'withSeconds', type: 'boolean', default: 'false', description: 'Adds the seconds.' },
          { name: 'minTime', type: 'string', description: 'The earliest time.' },
          { name: 'maxTime', type: 'string', description: 'The latest time.' },
          { name: 'variant', type: "'outline' | 'soft' | 'ghost'", default: "'outline'", description: "The box's look." },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field.' },
          { name: 'readOnly', type: 'boolean', default: 'false', description: 'Shows the time without letting it change.' },
        ]}
      />

      <H2 id="styling">Styling</H2>
      <p>
        The root is <code>.slp-time-input</code>, and the field box an <code>.slp-input</code>, styled as{' '}
        <a href="/ui/input#styling">Input's</a>.
      </p>
    </article>
  );
}
