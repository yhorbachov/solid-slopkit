import { Title } from '@solidjs/meta';
import { CodeBlock } from '../../components/CodeBlock';
import { Example } from '../../components/Example';
import { H2 } from '../../components/Heading';
import { PropsTable } from '../../components/PropsTable';

import Basic from '../../examples/text/basic';
import basicCode from '../../examples/text/basic.tsx?raw';
import Sizes from '../../examples/text/sizes';
import sizesCode from '../../examples/text/sizes.tsx?raw';
import Colors from '../../examples/text/colors';
import colorsCode from '../../examples/text/colors.tsx?raw';
import Weights from '../../examples/text/weights';
import weightsCode from '../../examples/text/weights.tsx?raw';
import Truncation from '../../examples/text/truncation';
import truncationCode from '../../examples/text/truncation.tsx?raw';
import Polymorphic from '../../examples/text/polymorphic';
import polymorphicCode from '../../examples/text/polymorphic.tsx?raw';

export default function TextPage() {
  return (
    <article class="docs-page">
      <Title>Text · slopkit</Title>
      <p class="docs-eyebrow">UI</p>
      <h1>Text</h1>
      <p class="docs-lead">
        Body text: a paragraph by default, or any element with <code>as</code>. Sizes come from the type scale tokens.
      </p>

      <H2 id="import">Import</H2>
      <CodeBlock code={`import { Text } from '@solid-slopkit/ui';`} />

      <H2 id="usage">Usage</H2>
      <p>
        The margin is reset to <code>0</code>, so space paragraphs with a <a href="/ui/stack">Stack</a>. Text doesn't take style
        props.
      </p>
      <Example component={Basic} code={basicCode} column />

      <H2 id="sizes">Sizes</H2>
      <p>
        <code>xs</code> to <code>xl</code>, from <code>--slp-font-size-*</code> and <code>--slp-line-height-*</code>. The default
        is <code>md</code>.
      </p>
      <Example component={Sizes} code={sizesCode} column />

      <H2 id="colors">Colors</H2>
      <p>
        <code>color</code> takes a color role. Without it, Text inherits its parent's color, so it works on colored surfaces too.{' '}
        <code>dimmed</code> mutes the text, with or without <code>color</code>.
      </p>
      <Example component={Colors} code={colorsCode} column />

      <H2 id="weights">Weights</H2>
      <p>Without a weight, Text inherits its parent's.</p>
      <Example component={Weights} code={weightsCode} column />

      <H2 id="truncation">Truncate and line clamp</H2>
      <p>
        <code>truncate</code> keeps one line with an ellipsis; <code>lineClamp</code> keeps that many lines. Both need a block
        element and a width.
      </p>
      <Example component={Truncation} code={truncationCode} column />

      <H2 id="polymorphic">Polymorphic and inherit</H2>
      <p>
        <code>as</code> renders another element, with that element's attributes. <code>inherit</code> takes font size and line
        height from the parent, for Text inside other text.
      </p>
      <Example component={Polymorphic} code={polymorphicCode} column />

      <H2 id="props">Props</H2>
      <p>Other props are passed to the rendered element.</p>
      <PropsTable
        rows={[
          { name: 'as', type: 'ValidComponent', default: "'p'", description: 'Element or component to render.' },
          {
            name: 'size',
            type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
            default: "'md'",
            description: (
              <>
                Font size and line height. Ignored with <code>inherit</code>.
              </>
            ),
          },
          {
            name: 'color',
            type: "'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'",
            description: "Color role. Inherits the parent's color when omitted.",
          },
          { name: 'dimmed', type: 'boolean', default: 'false', description: 'Mutes the text.' },
          {
            name: 'weight',
            type: "'normal' | 'medium' | 'semibold' | 'bold'",
            description: 'Font weight. Inherited when omitted.',
          },
          { name: 'truncate', type: 'boolean', default: 'false', description: 'One line, with an ellipsis.' },
          { name: 'lineClamp', type: 'number', description: 'Cuts the text after this many lines.' },
          {
            name: 'inherit',
            type: 'boolean',
            default: 'false',
            description: 'Takes font size and line height from the parent.',
          },
        ]}
      />

      <H2 id="styling">Styling</H2>
      <p>
        The root has the class <code>.slp-text</code>, and no slots. State and variant are attributes on it:{' '}
        <code>data-size</code> (absent with <code>inherit</code>), <code>data-color</code>, <code>data-dimmed</code>,{' '}
        <code>data-weight</code>, <code>data-truncate</code>, <code>data-line-clamp</code> and <code>data-inherit</code>. Its
        rules live in <code>@layer slopkit.components</code>, so unlayered CSS wins. The type scale tokens are set on{' '}
        <code>:root</code> in <code>slopkit.css</code>.
      </p>
    </article>
  );
}
