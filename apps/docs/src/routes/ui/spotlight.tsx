import { Title } from '@solidjs/meta';
import { CodeBlock } from '../../components/CodeBlock';
import { Example } from '../../components/Example';
import { H2 } from '../../components/Heading';
import { PropsTable } from '../../components/PropsTable';

import Basic from '../../examples/spotlight/basic';
import basicCode from '../../examples/spotlight/basic.tsx?raw';

export default function SpotlightPage() {
  return (
    <article class="docs-page">
      <Title>Spotlight · slopkit</Title>
      <p class="docs-eyebrow">UI</p>
      <h1>Spotlight</h1>
      <p class="docs-lead">
        A search over the app's actions, in a modal. Type to find an action, move with the arrows, and press Enter to trigger it.
      </p>

      <H2 id="import">Import</H2>
      <CodeBlock code={`import { Spotlight, useSpotlight, spotlight } from '@solid-slopkit/ui';`} />

      <H2 id="usage">Usage</H2>
      <p>
        Render <code>{'<Spotlight />'}</code> once, inside <code>{'<SlopkitUi>'}</code>, with its <code>actions</code>.{' '}
        <kbd>Ctrl</kbd>+<kbd>K</kbd> (<kbd>⌘</kbd>
        <kbd>K</kbd> on Apple devices) opens it from anywhere on the page, and so does <code>useSpotlight().open()</code>. An
        action has an <code>id</code>, a <code>label</code>, an optional <code>description</code>, <code>keywords</code> it's also
        found by, sections on either side, and <code>onTrigger</code>. Actions in a <code>{'{ group, actions }'}</code> entry are
        shown under its heading. <code>highlightQuery</code> marks what was typed in the labels.
      </p>
      <Example component={Basic} code={basicCode} />
      <p>
        The actions are read only while it's open, so the server renders none of them. Sections made before that, as in this
        example's component body, are passed as functions (<code>{'leftSection: () => <House />'}</code>): JSX made there would be
        made on the server without being rendered, and hydration couldn't find it.
      </p>

      <H2 id="search">Search</H2>
      <p>
        An action is found when its label, description or keywords contain every word of the query, ignoring case. An empty query
        shows them all. <code>filter</code> replaces this, for instance to rank the results; it gets the actions flattened, each
        with its <code>group</code>, and returns those to show, in order. <code>limit</code> caps how many are shown, and{' '}
        <code>nothingFound</code> is shown when there are none.
      </p>
      <CodeBlock
        code={`<Spotlight
  actions={actions}
  limit={8}
  filter={(query, actions) => actions.filter((action) => action.label.toLowerCase().startsWith(query.toLowerCase()))}
  nothingFound="No page has that name"
/>`}
      />

      <H2 id="opening">Opening and the shortcut</H2>
      <p>
        <code>useSpotlight()</code> returns <code>opened()</code>, <code>open()</code>, <code>close()</code> and{' '}
        <code>toggle()</code>. The <code>spotlight</code> object does the same from outside components, through the most recently
        mounted <code>{'<SlopkitUi>'}</code>. <code>shortcut</code> takes another key press, several, or <code>null</code> for
        none; <code>mod</code> is ⌘ on Apple devices and Ctrl elsewhere.
      </p>
      <CodeBlock
        code={`<Spotlight actions={actions} shortcut={['mod+K', '/']} />

import { spotlight } from '@solid-slopkit/ui';
spotlight.open();`}
      />

      <H2 id="accessibility">Accessibility</H2>
      <p>
        It's a modal dialog named by <code>searchLabel</code>. Focus stays in the search field, a combobox whose{' '}
        <code>aria-activedescendant</code> points at the active option of the listbox, and goes back to where it was once it
        closes. The arrows move through the actions, skipping disabled ones, Enter triggers the active one, and Escape closes it.
      </p>

      <H2 id="props">Props</H2>
      <p>
        Plus <a href="/ui/modal">Modal</a>'s <code>size</code> (default <code>lg</code>), <code>centered</code>,{' '}
        <code>closeOnClickOutside</code>, <code>closeOnEscape</code>, <code>returnFocus</code>, <code>lockScroll</code>,{' '}
        <code>transition</code> and <code>transitionDuration</code>.
      </p>
      <PropsTable
        rows={[
          { name: 'actions', type: 'SpotlightActions', description: 'Actions and groups of them. Required.' },
          {
            name: 'shortcut',
            type: 'string | string[] | null',
            default: "'mod+K'",
            description: 'The key press that opens and closes it.',
          },
          { name: 'query', type: 'string', description: 'The search text, for a controlled one.' },
          { name: 'onQueryChange', type: '(query: string) => void', description: 'Called as the search text changes.' },
          { name: 'clearQueryOnClose', type: 'boolean', default: 'true', description: 'Empties the search once closed.' },
          { name: 'filter', type: '(query, actions) => SpotlightAction[]', description: 'Picks the actions to show.' },
          { name: 'limit', type: 'number', description: 'Shows at most this many.' },
          { name: 'highlightQuery', type: 'boolean', default: 'false', description: "Marks the query's words in labels." },
          {
            name: 'closeOnActionTrigger',
            type: 'boolean',
            default: 'true',
            description: 'Whether triggering an action closes it.',
          },
          { name: 'searchPlaceholder', type: 'string', default: "'Search…'", description: "The field's placeholder." },
          { name: 'searchLabel', type: 'string', default: "'Search'", description: 'Names the field and the dialog.' },
          { name: 'actionsLabel', type: 'string', default: "'Actions'", description: 'Names the list of actions.' },
          {
            name: 'nothingFound',
            type: 'JSX.Element',
            default: "'Nothing found'",
            description: 'Shown when no action is found.',
          },
        ]}
      />

      <H2 id="action">Action</H2>
      <PropsTable
        rows={[
          { name: 'id', type: 'string', description: 'Unique among the actions. Required.' },
          { name: 'label', type: 'string', description: 'Shown and searched. Required.' },
          { name: 'description', type: 'string', description: 'A second line, searched too.' },
          { name: 'keywords', type: 'string[]', description: 'More words it is found by, not shown.' },
          { name: 'leftSection', type: 'JSX.Element | (() => JSX.Element)', description: 'Before the label.' },
          { name: 'rightSection', type: 'JSX.Element | (() => JSX.Element)', description: 'After the label.' },
          { name: 'disabled', type: 'boolean', description: "Shown, but can't be triggered." },
          { name: 'onTrigger', type: '() => void', description: 'Called on a click, or Enter while active.' },
        ]}
      />

      <H2 id="styling">Styling</H2>
      <p>
        The root is <code>.slp-spotlight</code>, on the <code>{'<dialog>'}</code>, which is also a <code>.slp-modal</code>. Its
        slots are <code>spotlight-search</code>, <code>spotlight-actions</code>, <code>spotlight-group</code>,{' '}
        <code>spotlight-group-label</code>, <code>spotlight-action</code> (with <code>data-active</code> and{' '}
        <code>data-disabled</code>), <code>spotlight-action-left-section</code>, <code>spotlight-action-body</code>,{' '}
        <code>spotlight-action-label</code>, <code>spotlight-action-description</code>,{' '}
        <code>spotlight-action-right-section</code> and <code>spotlight-empty</code>. The rules live in{' '}
        <code>@layer slopkit.components</code>, so unlayered CSS wins.
      </p>
    </article>
  );
}
