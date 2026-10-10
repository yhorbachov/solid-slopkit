import { Title } from '@solidjs/meta';
import { CodeBlock } from '../../components/CodeBlock';
import { Example } from '../../components/Example';
import { H2 } from '../../components/Heading';
import { PropsTable } from '../../components/PropsTable';

import Image from '../../examples/aspect-ratio/image';
import imageCode from '../../examples/aspect-ratio/image.tsx?raw';
import Content from '../../examples/aspect-ratio/content';
import contentCode from '../../examples/aspect-ratio/content.tsx?raw';

export default function AspectRatioPage() {
  return (
    <article class="docs-page">
      <Title>AspectRatio · slopkit</Title>
      <p class="docs-eyebrow">UI</p>
      <h1>AspectRatio</h1>
      <p class="docs-lead">
        Keeps its child at a width-to-height ratio, filling the available width. Use it for images, videos and embeds whose height
        should follow their width.
      </p>

      <H2 id="import">Import</H2>
      <CodeBlock code={`import { AspectRatio } from '@slopkit/ui';`} />

      <H2 id="image">Image</H2>
      <p>
        Images and videos are cropped to fit (<code>object-fit: cover</code>), so the same picture works at any ratio.
      </p>
      <Example component={Image} code={imageCode} column />

      <H2 id="any-content">Any content</H2>
      <p>
        The ratio is set on the child, so an <code>iframe</code> embed or any other element works the same way.
      </p>
      <Example component={Content} code={contentCode} column />

      <H2 id="in-flex">In a flex container</H2>
      <p>
        AspectRatio fills the width it is given. As a flex item, or anywhere else it would shrink to its content, give it a width,
        as the examples above do.
      </p>

      <H2 id="props">Props</H2>
      <p>Other props are passed to the rendered div.</p>
      <PropsTable
        rows={[
          {
            name: 'ratio',
            type: 'number',
            default: '1',
            description: (
              <>
                Width divided by height, e.g. <code>16 / 9</code>.
              </>
            ),
          },
        ]}
      />
    </article>
  );
}
