import { Title } from '@solidjs/meta';
import { CodeBlock } from '../../components/CodeBlock';
import { Example } from '../../components/Example';
import { H2 } from '../../components/Heading';
import { PropsTable } from '../../components/PropsTable';

import Basic from '../../examples/highlight/basic';
import basicCode from '../../examples/highlight/basic.tsx?raw';
import Terms from '../../examples/highlight/terms';
import termsCode from '../../examples/highlight/terms.tsx?raw';
import Search from '../../examples/highlight/search';
import searchCode from '../../examples/highlight/search.tsx?raw';

export default function HighlightPage() {
  return (
    <article class="docs-page">
      <Title>Highlight · slopkit</Title>
      <p class="docs-eyebrow">UI</p>
      <h1>Highlight</h1>
      <p class="docs-lead">
        Text with every match of a term wrapped in a <a href="/ui/mark">Mark</a>: a <code>span</code>.
      </p>

      <H2 id="import">Import</H2>
      <CodeBlock code={`import { Highlight } from '@solid-slopkit/ui';`} />

      <H2 id="usage">Usage</H2>
      <p>
        The children are a string. Matching ignores case. Highlight only adds the marks, so put it inside a{' '}
        <a href="/ui/text">Text</a>, a <a href="/ui/title">Title</a> or a link for its size and element.
      </p>
      <Example component={Basic} code={basicCode} />

      <H2 id="terms">Terms and case</H2>
      <p>
        <code>highlight</code> takes one term or an array; where terms overlap, the longer one wins. Characters such as{' '}
        <code>.</code> match literally. <code>caseSensitive</code> matches only the same case, and <code>color</code> goes to
        every mark.
      </p>
      <Example component={Terms} code={termsCode} column />

      <H2 id="search">Search results</H2>
      <p>
        A new term updates the text in place, so Highlight is cheap to drive from an input. An empty term shows the text unmarked.
      </p>
      <Example component={Search} code={searchCode} />

      <H2 id="props">Props</H2>
      <p>
        Other props are passed to the <code>span</code>.
      </p>
      <PropsTable
        rows={[
          { name: 'children', type: 'string', description: 'The text to search. Required.' },
          { name: 'highlight', type: 'string | string[]', description: 'The term or terms to mark. Required.' },
          {
            name: 'color',
            type: "'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'",
            default: "'warning'",
            description: 'Color role of the marks.',
          },
          { name: 'caseSensitive', type: 'boolean', default: 'false', description: 'Matches only the same case.' },
        ]}
      />

      <H2 id="styling">Styling</H2>
      <p>
        The root has the class <code>.slp-highlight</code>, and no slots: the marks are Mark components, so they take Mark's
        selectors and <code>--slp-mark-color</code>. Scope a style to highlights with <code>.slp-highlight .slp-mark</code>.
      </p>
    </article>
  );
}
