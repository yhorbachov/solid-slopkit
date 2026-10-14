import { Title } from '@solidjs/meta';
import { CodeBlock } from '../../components/CodeBlock';
import { Example } from '../../components/Example';
import { H2 } from '../../components/Heading';
import { PropsTable } from '../../components/PropsTable';

import Basic from '../../examples/nav-link/basic';
import basicCode from '../../examples/nav-link/basic.tsx?raw';
import Nested from '../../examples/nav-link/nested';
import nestedCode from '../../examples/nav-link/nested.tsx?raw';
import Variants from '../../examples/nav-link/variants';
import variantsCode from '../../examples/nav-link/variants.tsx?raw';

export default function NavLinkPage() {
  return (
    <article class="docs-page">
      <Title>NavLink · slopkit</Title>
      <p class="docs-eyebrow">UI</p>
      <h1>NavLink</h1>
      <p class="docs-lead">A link in a navigation list, such as a sidebar, with the current page drawn as active.</p>

      <H2 id="import">Import</H2>
      <CodeBlock code={`import { NavLink } from '@solid-slopkit/ui';`} />

      <H2 id="usage">Usage</H2>
      <p>
        A row as wide as its container: <code>label</code>, a smaller <code>description</code> under it, and a section on each
        side. <code>active</code> marks the current page, with <code>aria-current="page"</code>; NavLink can't tell which page is
        current, so set it from your router. A <code>disabled</code> link has no address. <code>as</code> renders a router's link
        component instead of an <code>a</code>. Put the links in a <code>nav</code>.
      </p>
      <Example component={Basic} code={basicCode} />

      <H2 id="nested">Nested links</H2>
      <p>
        Given children, a NavLink is a <code>button</code> that shows and hides them, indented under it, with a chevron that turns
        as it opens. It doesn't navigate itself. Use <code>defaultOpened</code> to start open, or <code>opened</code> and{' '}
        <code>onChange</code> to control it.
      </p>
      <Example component={Nested} code={nestedCode} />

      <H2 id="variants">Variants and colors</H2>
      <p>
        The active link is tinted with its color (<code>soft</code>) or filled with it (<code>solid</code>).
      </p>
      <Example component={Variants} code={variantsCode} />

      <H2 id="props">Props</H2>
      <p>
        Other props go to the link, or to a parent's <code>button</code>.
      </p>
      <PropsTable
        rows={[
          { name: 'label', type: 'JSX.Element', description: "The link's text." },
          { name: 'description', type: 'JSX.Element', description: 'A second, smaller line under the label.' },
          { name: 'leftSection', type: 'JSX.Element', description: 'Content before the label, usually an icon.' },
          { name: 'rightSection', type: 'JSX.Element', description: 'Content after the label, such as a count.' },
          { name: 'active', type: 'boolean', default: 'false', description: 'Marks the current page.' },
          { name: 'variant', type: "'soft' | 'solid'", default: "'soft'", description: 'How the active link is drawn.' },
          { name: 'color', type: 'SlopColor', default: "'primary'", description: "The active link's color role." },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Keeps it from being followed or opened.' },
          { name: 'noWrap', type: 'boolean', default: 'false', description: 'Cuts long text with an ellipsis.' },
          { name: 'as', type: 'ValidComponent', default: "'a'", description: 'Renders another link component.' },
          { name: 'children', type: 'JSX.Element', description: 'Nested NavLinks, which make it a parent.' },
          { name: 'opened', type: 'boolean', description: "Whether a parent's children show, when controlled." },
          { name: 'defaultOpened', type: 'boolean', default: 'false', description: 'Whether they show at first.' },
          { name: 'onChange', type: '(opened: boolean) => void', description: 'Called when a parent is pressed.' },
          { name: 'chevron', type: 'JSX.Element', description: "Replaces a parent's chevron." },
          { name: 'disableChevronRotation', type: 'boolean', default: 'false', description: 'Keeps the chevron still.' },
        ]}
      />

      <H2 id="styling">Styling</H2>
      <p>
        The root is <code>.slp-nav-link</code> (the link, or a parent's button), with <code>data-current</code>,{' '}
        <code>data-variant</code>, <code>data-color</code>, <code>data-disabled</code> and, on a parent, <code>data-opened</code>.
        Inside are <code>[data-slot="nav-link-left-section"]</code>, <code>nav-link-body</code> holding{' '}
        <code>nav-link-label</code> and <code>nav-link-description</code>, <code>nav-link-right-section</code> and a parent's{' '}
        <code>nav-link-chevron</code>. A parent's children follow it in <code>.slp-nav-link-children</code>, whose{' '}
        <code>nav-link-children-body</code> sets the indent. <code>--slp-nav-link-color</code> and{' '}
        <code>--slp-nav-link-content</code> set the active colors. The rules live in <code>@layer slopkit.components</code>, so
        unlayered CSS wins.
      </p>
    </article>
  );
}
