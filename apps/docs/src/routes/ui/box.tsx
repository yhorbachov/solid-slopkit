import { Title } from '@solidjs/meta';
import { CodeBlock } from '../../components/CodeBlock';
import { Example } from '../../components/Example';
import { H2 } from '../../components/Heading';

import Basic from '../../examples/box/basic';
import basicCode from '../../examples/box/basic.tsx?raw';
import Padding from '../../examples/box/padding';
import paddingCode from '../../examples/box/padding.tsx?raw';
import ResponsivePadding from '../../examples/box/responsive-padding';
import responsivePaddingCode from '../../examples/box/responsive-padding.tsx?raw';
import Style from '../../examples/box/style';
import styleCode from '../../examples/box/style.tsx?raw';
import Polymorphic from '../../examples/box/polymorphic';
import polymorphicCode from '../../examples/box/polymorphic.tsx?raw';

export default function BoxPage() {
  return (
    <article class="docs-page">
      <Title>Box · slopkit</Title>
      <p class="docs-eyebrow">UI</p>
      <h1>Box</h1>
      <p class="docs-lead">Work in progress. This page is a sandbox for the component.</p>

      <H2 id="import">Import</H2>
      <CodeBlock code={`import { Box } from '@slopkit/ui';`} />

      <H2 id="basic">Basic</H2>
      <Example component={Basic} code={basicCode} />

      <H2 id="padding">Padding</H2>
      <p>
        <code>p</code>, <code>px</code>, <code>py</code>, <code>pt</code>, <code>pr</code>, <code>pb</code> and <code>pl</code>.
        Values are multiples of <code>--slp-spacing</code> (0.25rem), so <code>4</code> is 1rem. The more specific prop wins. Box
        generates one class per distinct padding and injects its CSS once with <code>&lt;Style&gt;</code>.
      </p>
      <Example component={Padding} code={paddingCode} />

      <H2 id="responsive">Responsive</H2>
      <p>
        Pass an object of breakpoints. Mobile-first: each value applies from its min-width up (xs 36em, sm 48em, md 62em, lg 75em,
        xl 88em).
      </p>
      <Example component={ResponsivePadding} code={responsivePaddingCode} />

      <H2 id="style">Style</H2>
      <p>
        <code>style</code> accepts an object or a string, and is merged with the box's own CSS variables.
      </p>
      <Example component={Style} code={styleCode} />

      <H2 id="polymorphic">Polymorphic</H2>
      <Example component={Polymorphic} code={polymorphicCode} />
    </article>
  );
}
