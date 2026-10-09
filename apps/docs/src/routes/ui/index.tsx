import { Title } from '@solidjs/meta';
import { CodeBlock } from '../../components/CodeBlock';
import { H2 } from '../../components/Heading';

export default function UiOverview() {
  return (
    <article class="docs-page">
      <Title>UI · slopkit</Title>
      <p class="docs-eyebrow">UI</p>
      <h1>Overview</h1>
      <p class="docs-lead">
        <code>@slopkit/ui</code> is a component library for SolidJS 2, styled with plain CSS and CSS variables. No CSS-in-JS and
        no utility framework.
      </p>

      <H2 id="installation">Installation</H2>
      <CodeBlock lang="bash" code="pnpm add @slopkit/ui" />

      <H2 id="styles">Styles</H2>
      <p>
        Import the base styles and a theme once, at the root of your app. The base file declares the cascade layers and color
        palettes. The theme sets the <code>--slp-color-*</code> tokens components read.
      </p>
      <CodeBlock
        code={`import '@slopkit/ui/styles/slopkit.css';
import '@slopkit/ui/styles/default-theme.css';`}
      />
      <p>
        Everything lives in <code>@layer slopkit.*</code> cascade layers, so your own unlayered CSS always wins without
        specificity fights.
      </p>

      <H2 id="usage">Usage</H2>
      <p>
        Wrap the app in <code>&lt;SlopkitUi&gt;</code> once. Components that generate CSS at runtime, such as Box, add it there.
      </p>
      <CodeBlock
        code={`import { SlopkitUi } from '@slopkit/ui';

export function Root() {
  return <SlopkitUi>{/* your app */}</SlopkitUi>;
}`}
      />
      <CodeBlock
        code={`import { Button } from '@slopkit/ui';

export function Toolbar() {
  return <Button color="primary">Save</Button>;
}`}
      />

      <H2 id="components">Components</H2>
      <ul>
        <li>
          <a href="/ui/button">Button</a>
        </li>
      </ul>
    </article>
  );
}
