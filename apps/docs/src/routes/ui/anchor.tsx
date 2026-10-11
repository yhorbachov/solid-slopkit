import { Title } from '@solidjs/meta';
import { CodeBlock } from '../../components/CodeBlock';
import { Example } from '../../components/Example';
import { H2 } from '../../components/Heading';
import { PropsTable } from '../../components/PropsTable';

import Basic from '../../examples/anchor/basic';
import basicCode from '../../examples/anchor/basic.tsx?raw';
import Underline from '../../examples/anchor/underline';
import underlineCode from '../../examples/anchor/underline.tsx?raw';
import Variants from '../../examples/anchor/variants';
import variantsCode from '../../examples/anchor/variants.tsx?raw';

export default function AnchorPage() {
  return (
    <article class="docs-page">
      <Title>Anchor · slopkit</Title>
      <p class="docs-eyebrow">UI</p>
      <h1>Anchor</h1>
      <p class="docs-lead">
        A link: <a href="/ui/text">Text</a> rendered as an <code>a</code>, in the primary color.
      </p>

      <H2 id="import">Import</H2>
      <CodeBlock code={`import { Anchor } from '@solid-slopkit/ui';`} />

      <H2 id="usage">Usage</H2>
      <p>
        Without <code>size</code>, Anchor takes the surrounding font size and line height, so it fits inside any text.
      </p>
      <Example component={Basic} code={basicCode} column />

      <H2 id="underline">Underline</H2>
      <p>
        <code>always</code> is the default. Keep it for links inside body text, so they stand out without relying on color; use{' '}
        <code>hover</code> for navigation-style links.
      </p>
      <Example component={Underline} code={underlineCode} />

      <H2 id="size-color-weight">Size, color and weight</H2>
      <p>
        Text's props work too: <code>size</code>, <code>color</code>, <code>dimmed</code>, <code>weight</code>,{' '}
        <code>truncate</code> and <code>lineClamp</code>.
      </p>
      <Example component={Variants} code={variantsCode} />

      <H2 id="router-links">Router links</H2>
      <p>
        <code>as</code> renders another link component and passes it every other prop. For a new tab, pass{' '}
        <code>target="_blank"</code> and <code>rel="noreferrer"</code> yourself.
      </p>
      <CodeBlock
        code={`import { A } from '@solidjs/router';

<Anchor as={A} href="/settings">Settings</Anchor>`}
      />

      <H2 id="props">Props</H2>
      <p>
        Other props, such as <code>href</code>, <code>target</code> and <code>rel</code>, are passed to the link.
      </p>
      <PropsTable
        rows={[
          { name: 'as', type: 'ValidComponent', default: "'a'", description: 'Element or component to render.' },
          {
            name: 'underline',
            type: "'always' | 'hover' | 'never'",
            default: "'always'",
            description: 'When the link is underlined.',
          },
          {
            name: 'size',
            type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
            default: 'inherited',
            description: 'Font size and line height. Inherited from the parent when omitted.',
          },
          {
            name: 'color',
            type: "'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'",
            default: "'primary'",
            description: 'Color role.',
          },
          { name: 'dimmed', type: 'boolean', default: 'false', description: 'Mutes the link.' },
          {
            name: 'weight',
            type: "'normal' | 'medium' | 'semibold' | 'bold'",
            description: 'Font weight. Inherited when omitted.',
          },
          {
            name: 'truncate',
            type: 'boolean',
            default: 'false',
            description: 'One line, with an ellipsis. Needs a block display.',
          },
          { name: 'lineClamp', type: 'number', description: 'Cuts the text after this many lines.' },
        ]}
      />

      <H2 id="styling">Styling</H2>
      <p>
        The root has the classes <code>.slp-anchor</code> and <code>.slp-text</code>, and no slots. State and variant are
        attributes on it: <code>data-underline</code>, plus Text's (<code>data-color</code>, <code>data-size</code> or{' '}
        <code>data-inherit</code>, <code>data-dimmed</code>, <code>data-weight</code>, <code>data-truncate</code>,{' '}
        <code>data-line-clamp</code>). Its rules live in <code>@layer slopkit.components</code>, so unlayered CSS wins.
      </p>
    </article>
  );
}
