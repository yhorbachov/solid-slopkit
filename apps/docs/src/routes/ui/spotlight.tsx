import { Title } from '@solidjs/meta';
import { CodeBlock } from '../../components/CodeBlock';
import { Example } from '../../components/Example';
import { H2 } from '../../components/Heading';
import { PropsTable } from '../../components/PropsTable';
import Basic from '../../examples/spotlight/basic';
import basicCode from '../../examples/spotlight/basic.tsx?raw';
import Controlled from '../../examples/spotlight/controlled';
import controlledCode from '../../examples/spotlight/controlled.tsx?raw';

export default function SpotlightPage() {
  return (
    <article class="docs-page">
      <Title>Spotlight · slopkit</Title>
      <p class="docs-eyebrow">UI</p>
      <h1>Spotlight</h1>
      <p class="docs-lead">Find and run an action from a searchable command palette.</p>
      <H2 id="import">Import</H2>
      <CodeBlock code={`import { Spotlight, type SpotlightAction } from '@solid-slopkit/ui';`} />
      <H2 id="usage">Usage</H2>
      <p>
        Keep <code>opened</code> in a signal, open from an app button or shortcut, and close from <code>onClose</code>. Render
        inside <code>SlopkitUi</code>. The palette uses a modal dialog in the top layer, inheriting its owner's theme.
      </p>
      <Example component={Basic} code={basicCode} />
      <H2 id="search">Search and actions</H2>
      <p>
        Search matches labels, descriptions and keywords, ignoring case and surrounding spaces. Use <code>group</code> for
        headings: groups follow first-seen order, and actions keep their order within each group. Disabled actions stay visible
        but cannot run. Each action needs a unique <code>id</code>. Its <code>onTrigger</code> runs before{' '}
        <code>onActionTrigger</code>, then the palette asks to close.
      </p>
      <p>
        Use <code>filter</code> to replace matching and <code>limit</code> to cap results across groups. Empty groups disappear.
        Override <code>nothingFound</code>, <code>searchLabel</code>, <code>searchPlaceholder</code> and <code>actionsLabel</code>{' '}
        for your language.
      </p>
      <H2 id="controlled">Controlled search and repeatable commands</H2>
      <p>
        Uncontrolled search persists across openings. With <code>query</code> and <code>onQueryChange</code>, the app can clear it
        on opening. Turn off <code>closeOnActionTrigger</code> for repeatable commands. The app owns async progress and errors.
      </p>
      <Example component={Controlled} code={controlledCode} />
      <H2 id="keyboard">Keyboard and focus</H2>
      <p>
        Opening focuses search. Up and Down move through enabled actions and loop; Enter runs the active action. Typing clears
        activation. Focus stays in search while navigating. Editing keys keep their native behavior. Tab moves between dialog
        controls, Escape closes, and focus returns to the opener after the exit animation. Action sections are decorative and
        cannot contain interactive elements.
      </p>
      <H2 id="props">Props</H2>
      <PropsTable
        rows={[
          { name: 'opened', type: 'boolean', description: 'Controlled visibility.' },
          { name: 'onClose', type: '() => void', description: 'Requests closure.' },
          { name: 'actions', type: 'readonly SpotlightAction[]', description: 'Actions with unique IDs.' },
          { name: 'query / defaultQuery', type: 'string', default: "''", description: 'Controlled / initial search text.' },
          { name: 'onQueryChange', type: '(query: string) => void', description: 'Reports typed text.' },
          {
            name: 'onActionTrigger',
            type: '(action: SpotlightAction) => void',
            description: 'Called after the action callback.',
          },
          { name: 'closeOnActionTrigger', type: 'boolean', default: 'true', description: 'Requests closure after activation.' },
          {
            name: 'filter',
            type: '(query: string, action: SpotlightAction) => boolean',
            description: 'Custom matching; receives raw query.',
          },
          { name: 'limit', type: 'number', description: 'Maximum results across groups. Use a finite number.' },
          { name: 'searchLabel', type: 'string', default: "'Search actions'", description: 'Search accessible name.' },
          { name: 'searchPlaceholder', type: 'string', default: "'Search actions…'", description: 'Search placeholder.' },
          { name: 'actionsLabel', type: 'string', default: "'Actions'", description: 'Listbox accessible name.' },
          { name: 'nothingFound', type: 'string', default: "'No actions found'", description: 'Empty results message.' },
        ]}
      />
      <p>
        Also accepts the shared <a href="/ui/modal">Modal</a> behavior props: <code>title</code>, <code>withCloseButton</code>,
        <code>closeButtonLabel</code>, <code>closeOnEscape</code>, <code>closeOnClickOutside</code>, <code>returnFocus</code>,
        <code>lockScroll</code>, <code>transition</code>, <code>transitionDuration</code> and <code>onExited</code>, plus native
        dialog attributes. The default animation is <code>pop</code>, lasting 200 ms. Without a title, the dialog defaults to the
        name “Spotlight”; override with <code>aria-label</code>.
      </p>
      <p>
        Pass JSX decorations as functions, such as <code>{`rightSection: () => <Kbd>↵</Kbd>`}</code>, to create them when the
        action mounts after hydration.
      </p>
      <H2 id="action-props">Action props</H2>
      <PropsTable
        rows={[
          { name: 'id / label', type: 'string', description: 'Unique ID / visible name; required.' },
          { name: 'description', type: 'string', description: 'Visible context below the label.' },
          { name: 'keywords', type: 'readonly string[]', description: 'Extra search terms.' },
          { name: 'group', type: 'string', description: 'Group heading.' },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Cannot be activated.' },
          { name: 'onTrigger', type: '() => void', description: 'Runs on activation.' },
          {
            name: 'leftSection / rightSection',
            type: 'JSX.Element | (() => JSX.Element)',
            description: 'Decorative content, hidden from assistive technology.',
          },
        ]}
      />
      <H2 id="styling">Styling</H2>
      <p>
        Use <code>.slp-spotlight</code> and namespaced slots: <code>spotlight-content</code>, <code>spotlight-header</code>,{' '}
        <code>spotlight-title</code>,<code>spotlight-close</code>, <code>spotlight-body</code>, <code>spotlight-search</code>,{' '}
        <code>spotlight-actions</code>,<code>spotlight-group</code>, <code>spotlight-group-label</code>,{' '}
        <code>spotlight-action</code>, <code>spotlight-action-body</code>,<code>spotlight-action-label</code>,{' '}
        <code>spotlight-action-description</code>, <code>spotlight-action-left-section</code>,
        <code>spotlight-action-right-section</code> and <code>spotlight-empty</code>. Actions expose <code>data-value</code>,
        <code>data-active</code> and <code>data-disabled</code>; the dialog exposes <code>data-status</code>. Unlayered CSS
        overrides rules in <code>@layer slopkit.components</code>.
      </p>
    </article>
  );
}
