import { Title } from '@solidjs/meta';
import { CodeBlock } from '../../components/CodeBlock';
import { Example } from '../../components/Example';
import { H2 } from '../../components/Heading';
import { PropsTable } from '../../components/PropsTable';

import Basic from '../../examples/select/basic';
import basicCode from '../../examples/select/basic.tsx?raw';
import Searchable from '../../examples/select/searchable';
import searchableCode from '../../examples/select/searchable.tsx?raw';
import States from '../../examples/select/states';
import statesCode from '../../examples/select/states.tsx?raw';

export default function SelectPage() {
  return (
    <article class="docs-page">
      <Title>Select · slopkit</Title>
      <p class="docs-eyebrow">UI</p>
      <h1>Select</h1>
      <p class="docs-lead">A labelled field that picks one value from a list in a dropdown, optionally searchable.</p>

      <H2 id="import">Import</H2>
      <CodeBlock code={`import { Select } from '@solid-slopkit/ui';`} />

      <H2 id="usage">Usage</H2>
      <p>
        <code>data</code> holds the options. The field is a button with <code>role="combobox"</code> that shows the selected label
        or the <code>placeholder</code>. A press anywhere on it opens the list; a click on the label only focuses it. With the
        keyboard, Enter, Space and the arrows open it, typing a letter jumps to the first option that starts with it, Enter or
        Space chooses, and Escape or Tab closes. Focus stays on the field throughout. The selected option has a check mark.
      </p>
      <Example component={Basic} code={basicCode} />

      <H2 id="searchable">Searchable, grouped and clearable</H2>
      <p>
        <code>searchable</code> makes the field a text field that filters the options by their labels as you type and makes the
        first match active; closing without choosing shows the selection again. Options can be strings, items with a{' '}
        <code>value</code>, <code>label</code> and <code>disabled</code>, or groups under a heading. <code>clearable</code> adds a
        button that clears the value. Controlled here with <code>value</code> and <code>onChange</code>, which gets the value and
        its item, or <code>null</code> when cleared.
      </p>
      <Example component={Searchable} code={searchableCode} />

      <H2 id="states">Sections, variants and states</H2>
      <p>
        The field box is an Input's: <code>variant</code>, <code>size</code>, <code>leftSection</code>, and{' '}
        <code>rightSection</code>, which replaces the chevron. The label, description and error work as on TextInput.{' '}
        <code>readOnly</code> and <code>disabled</code> keep it closed. <code>name</code> submits the value with a form through a
        hidden input.
      </p>
      <Example component={States} code={statesCode} />

      <H2 id="props">Props</H2>
      <p>
        <code>class</code> and <code>style</code> go to the root, with the label and texts; other props, such as{' '}
        <code>aria-label</code> or <code>onBlur</code>, go to the field. Plus <code>label</code>, <code>labelSection</code>,{' '}
        <code>description</code>, <code>error</code>, <code>required</code>, <code>withAsterisk</code>, <code>size</code> and{' '}
        <code>id</code>, as on TextInput.
      </p>
      <PropsTable
        rows={[
          { name: 'data', type: 'SelectData', description: 'The options: strings, items and groups. Required.' },
          { name: 'value', type: 'string | null', description: 'The selected value, when controlled.' },
          { name: 'defaultValue', type: 'string | null', default: 'null', description: 'The value it starts with.' },
          {
            name: 'onChange',
            type: '(value: string | null, item: SelectItem | null) => void',
            description: 'Called when the selection changes.',
          },
          { name: 'placeholder', type: 'string', description: 'Shown while nothing is selected.' },
          { name: 'searchable', type: 'boolean', default: 'false', description: 'Lets typing filter the options. Read once.' },
          { name: 'clearable', type: 'boolean', default: 'false', description: 'A button that clears the selection.' },
          { name: 'clearLabel', type: 'string', default: "'Clear'", description: "The clear button's name." },
          {
            name: 'allowDeselect',
            type: 'boolean',
            default: 'false',
            description: 'Choosing the selected option again clears it.',
          },
          {
            name: 'nothingFoundMessage',
            type: 'string',
            default: "'Nothing found'",
            description: 'Shown when no option matches the search.',
          },
          { name: 'name', type: 'string', description: 'Submits the value with a form.' },
          { name: 'readOnly', type: 'boolean', default: 'false', description: 'Shows the value without letting it change.' },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field.' },
          { name: 'variant', type: "'outline' | 'soft' | 'ghost'", default: "'outline'", description: "The box's look." },
          { name: 'leftSection', type: 'JSX.Element', description: 'Content before the value.' },
          { name: 'rightSection', type: 'JSX.Element', default: 'a chevron', description: 'Content after the value.' },
          {
            name: 'comboboxProps',
            type: '{ position, offset, matchTargetWidth, transition, transitionDuration }',
            description: "The dropdown's position and animation.",
          },
        ]}
      />

      <H2 id="styling">Styling</H2>
      <p>
        The root has the classes <code>.slp-select</code> and <code>.slp-input-wrapper</code>; the field box is an{' '}
        <code>.slp-input</code>, and the dropdown a Combobox's (<code>.slp-combobox</code>, <code>.slp-combobox-option</code>).
        Inside are <code>[data-slot="select-value"]</code> (with <code>data-placeholder</code> while nothing is selected),{' '}
        <code>[data-slot="select-option-check"]</code>, <code>[data-slot="select-option-label"]</code> and{' '}
        <code>[data-slot="select-clear"]</code>. The rules live in <code>@layer slopkit.components</code>, so unlayered CSS wins.
      </p>
    </article>
  );
}
