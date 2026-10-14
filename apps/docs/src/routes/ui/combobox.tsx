import { Title } from '@solidjs/meta';
import { CodeBlock } from '../../components/CodeBlock';
import { Example } from '../../components/Example';
import { H2 } from '../../components/Heading';
import { PropsTable } from '../../components/PropsTable';

import Basic from '../../examples/combobox/basic';
import basicCode from '../../examples/combobox/basic.tsx?raw';
import ButtonTarget from '../../examples/combobox/button-target';
import buttonTargetCode from '../../examples/combobox/button-target.tsx?raw';
import Multiple from '../../examples/combobox/multiple';
import multipleCode from '../../examples/combobox/multiple.tsx?raw';

export default function ComboboxPage() {
  return (
    <article class="docs-page">
      <Title>Combobox · slopkit</Title>
      <p class="docs-eyebrow">UI</p>
      <h1>Combobox</h1>
      <p class="docs-lead">
        The building block for picking from a list of options while focus stays on a field or a button. Select, Autocomplete,
        MultiSelect and TagsInput are built from it; use it directly for a picker they don't cover.
      </p>

      <H2 id="import">Import</H2>
      <CodeBlock code={`import { Combobox, createCombobox } from '@solid-slopkit/ui';`} />

      <H2 id="usage">Usage</H2>
      <p>
        <code>createCombobox()</code> makes a store that holds whether it's open and which option is active. Pass it as{' '}
        <code>store</code>, and call its methods from your own handlers: here the input opens it on a click, and on input filters
        the options and makes the first match active. <code>Combobox.Target</code>'s child gets the attributes to spread on an
        input or a button: <code>role="combobox"</code>, the ARIA state, and the key handling. The options go in{' '}
        <code>Combobox.Options</code>, a listbox you name with <code>aria-label</code>, inside <code>Combobox.Dropdown</code>.
      </p>
      <Example component={Basic} code={basicCode} />

      <H2 id="keyboard">Keyboard and focus</H2>
      <p>
        Focus stays on the target. ArrowDown and ArrowUp open it on the selected option, else the first or last, and then move the
        active option, which is announced through <code>aria-activedescendant</code> and scrolled into view. Home and End go to
        the first and last option, except in a text field, where they move the caret. Enter chooses the active option; Escape, Tab
        and a press outside close it. Alt+ArrowDown opens it without an active option. Disabled options are skipped.
      </p>

      <H2 id="button-target">A button as the target</H2>
      <p>
        Any element that takes a ref can be the target. Here a Button opens and closes it on a click (Enter and Space too), the
        options are in groups, the current value is <code>selected</code>, and one option is <code>disabled</code>. The dropdown
        isn't matched to the button's width.
      </p>
      <Example component={ButtonTarget} code={buttonTargetCode} />

      <H2 id="multiple">Several choices</H2>
      <p>
        <code>closeOnOptionSubmit={'{false}'}</code> keeps it open after a choice. Mark every chosen option <code>selected</code>{' '}
        and set <code>aria-multiselectable="true"</code> on the options.
      </p>
      <Example component={Multiple} code={multipleCode} />

      <H2 id="store">Store</H2>
      <PropsTable
        rows={[
          { name: 'opened()', type: 'boolean', description: 'Whether the dropdown is open.' },
          {
            name: 'open(), close(), toggle()',
            type: 'void',
            description: 'Open or close it. The options are rendered by the time open() returns.',
          },
          { name: 'activeId()', type: 'string | undefined', description: "The active option's id." },
          {
            name: 'activateFirst(), activateLast()',
            type: 'boolean',
            description: 'Make the first or last enabled option active. Whether there was one.',
          },
          {
            name: 'activateNext(), activatePrevious()',
            type: 'boolean',
            description: 'Move the active option, from the first or last when none is active.',
          },
          { name: 'activateSelected()', type: 'boolean', description: 'Makes the first selected option active.' },
          { name: 'clearActive()', type: 'void', description: 'Makes no option active.' },
          { name: 'submitActive()', type: 'boolean', description: 'Chooses the active option, as a click would.' },
        ]}
      />
      <p>
        <code>createCombobox</code> takes <code>opened</code> (an accessor, for a controlled one), <code>defaultOpened</code>,{' '}
        <code>onChange(opened)</code> and <code>loop</code> (an accessor, default <code>true</code>). The <code>activate*</code>{' '}
        methods render pending changes first, so calling one right after changing the query finds the new options.
      </p>

      <H2 id="props">Props</H2>
      <PropsTable
        rows={[
          { name: 'store', type: 'ComboboxStore', description: 'The state, from createCombobox(). Required.' },
          { name: 'onOptionSubmit', type: '(value: string) => void', description: "Called with the chosen option's value." },
          { name: 'closeOnOptionSubmit', type: 'boolean', default: 'true', description: 'Whether choosing an option closes it.' },
          { name: 'position', type: 'ComboboxPosition', default: "'bottom'", description: 'Where the dropdown goes.' },
          { name: 'offset', type: 'number', default: '4', description: 'Gap between the target and the dropdown, in px.' },
          {
            name: 'matchTargetWidth',
            type: 'boolean',
            default: 'true',
            description: 'Makes the dropdown as wide as the target.',
          },
          { name: 'closeOnEscape', type: 'boolean', default: 'true', description: 'Whether Escape closes it.' },
          { name: 'closeOnClickOutside', type: 'boolean', default: 'true', description: 'Whether a press outside closes it.' },
          { name: 'transition', type: 'TransitionName', default: "'fade'", description: "The dropdown's animation." },
          { name: 'transitionDuration', type: 'number', default: '150', description: 'Duration of the animation, in ms.' },
        ]}
      />
      <p>
        <code>Combobox.Option</code> takes <code>value</code>, <code>selected</code> and <code>disabled</code>;{' '}
        <code>Combobox.Group</code> takes <code>label</code>. The parts pass other props to their <code>div</code>.
      </p>

      <H2 id="styling">Styling</H2>
      <p>
        The dropdown has the class <code>.slp-combobox</code> (with <code>data-placement</code>, <code>data-status</code> and{' '}
        <code>data-transition</code>), the listbox <code>.slp-combobox-options</code>, the options{' '}
        <code>.slp-combobox-option</code> with <code>data-active</code>, <code>data-selected</code> and <code>data-disabled</code>
        , and there are <code>.slp-combobox-group</code> with <code>[data-slot="combobox-group-label"]</code> and{' '}
        <code>.slp-combobox-empty</code>. The listbox scrolls past 15rem; change it with a selector. The rules live in{' '}
        <code>@layer slopkit.components</code>, so unlayered CSS wins.
      </p>
    </article>
  );
}
