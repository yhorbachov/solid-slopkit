import { Title } from '@solidjs/meta';
import { CodeBlock } from '../../components/CodeBlock';
import { Example } from '../../components/Example';
import { H2 } from '../../components/Heading';
import { CssVarsTable, PropsTable } from '../../components/PropsTable';

import Sizes from '../../examples/container/sizes';
import sizesCode from '../../examples/container/sizes.tsx?raw';
import Fluid from '../../examples/container/fluid';
import fluidCode from '../../examples/container/fluid.tsx?raw';

export default function ContainerPage() {
  return (
    <article class="docs-page">
      <Title>Container · slopkit</Title>
      <p class="docs-eyebrow">UI</p>
      <h1>Container</h1>
      <p class="docs-lead">
        Centers its content horizontally, with a max width and inline padding. Wrap a page, or each full-width section of one, so
        content lines up on the same edges and never touches the screen edge.
      </p>

      <H2 id="import">Import</H2>
      <CodeBlock code={`import { Container } from '@solid-slopkit/ui';`} />

      <H2 id="size">Size</H2>
      <p>
        A preset from <code>xs</code> to <code>xl</code>, spacing units, or any CSS length. The size is the outer width, padding
        included. The default is <code>md</code>.
      </p>
      <Example component={Sizes} code={sizesCode} column />

      <H2 id="fluid">Fluid</H2>
      <p>
        <code>fluid</code> drops the max width and keeps the padding.
      </p>
      <Example component={Fluid} code={fluidCode} column />

      <H2 id="css-variables">CSS variables</H2>
      <p>
        The presets are set on <code>:root</code> in <code>slopkit.css</code>. Override them there or in a theme to change every
        container; set <code>--slp-container-padding</code> on a container or any ancestor.
      </p>
      <CssVarsTable
        rows={[
          { name: '--slp-container-size-xs', default: '33.75rem', description: 'Width of size="xs" (540px).' },
          { name: '--slp-container-size-sm', default: '45rem', description: 'Width of size="sm" (720px).' },
          { name: '--slp-container-size-md', default: '60rem', description: 'Width of size="md" (960px).' },
          { name: '--slp-container-size-lg', default: '71.25rem', description: 'Width of size="lg" (1140px).' },
          { name: '--slp-container-size-xl', default: '82.5rem', description: 'Width of size="xl" (1320px).' },
          { name: '--slp-container-padding', default: 'calc(var(--slp-spacing) * 4)', description: 'Inline padding.' },
        ]}
      />

      <H2 id="props">Props</H2>
      <p>Other props are passed to the rendered div.</p>
      <PropsTable
        rows={[
          {
            name: 'size',
            type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string",
            default: "'md'",
            description: 'Max width: a preset, spacing units, or a CSS length.',
          },
          { name: 'fluid', type: 'boolean', default: 'false', description: 'Full width, ignoring size.' },
        ]}
      />
    </article>
  );
}
