import { Title } from '@solidjs/meta';
import { CodeBlock } from '../../components/CodeBlock';
import { DocTable } from '../../components/DocTable';
import { Example } from '../../components/Example';
import { H2 } from '../../components/Heading';

import Usage from '../../examples/forms/usage';
import usageCode from '../../examples/forms/usage.tsx?raw';
import FieldState from '../../examples/forms/field-state';
import fieldStateCode from '../../examples/forms/field-state.tsx?raw';

const RELEASES_URL = 'https://github.com/yhorbachov/solid-slopkit/releases';

const STATE: [string, string][] = [
  ['$value()', "The field's current value, read from the store."],
  ['$set(next)', "Writes the field's value. On a container it replaces the subtree; on the root, the model."],
  ['$dirty()', 'True when the value differs from the value at form() time (deep compare).'],
  ['$touched()', 'True once the field was left (blurred) or submitted. On a container: any descendant touched.'],
  ['$markTouched()', 'Marks the field touched. bind() and control() call it on blur.'],
  ['$reset()', 'Restores the value to its initial snapshot and clears touched, across the subtree.'],
  ['$errors()', "The field's validation errors. On a container: its own plus every enabled descendant's."],
  ['$valid() / $invalid()', 'No errors / at least one. A container is valid only when every enabled descendant is.'],
  ['$disabled() / $hidden() / $readonly()', 'Set by rules here, or inherited from a container above.'],
  ['$pending()', 'True while an async validator on the field, or on a descendant, is in flight.'],
  ['$metadata(key)', 'The value a rule declared for a metadata key, or undefined.'],
  ['$submitting()', 'True while a submit() handler runs. One form-wide fact, readable on every field.'],
];

export default function FormsOverview() {
  return (
    <article class="docs-page">
      <Title>Forms · slopkit</Title>
      <p class="docs-eyebrow">Forms</p>
      <h1>Overview</h1>
      <p class="docs-lead">
        <code>@solid-slopkit/forms</code> is schema-driven form state for SolidJS 2: a Solid store is the model, rules are
        attached to paths, and every field's state is a signal.
      </p>

      <H2 id="installation">Installation</H2>
      <p>
        Like the other slopkit packages, it isn't published to npm. Each version is a tarball attached to a{' '}
        <a href={RELEASES_URL}>GitHub Release</a>. Replace <code>0.0.1</code> with the version you want.
      </p>
      <CodeBlock lang="bash" code={`pnpm add ${RELEASES_URL}/download/forms-v0.0.1/solid-slopkit-forms-0.0.1.tgz`} />
      <p>
        It needs <code>solid-js</code> and <code>@solidjs/web</code> 2.x. It doesn't depend on <code>@solid-slopkit/ui</code>, but
        its bindings produce exactly the props the UI inputs take.
      </p>

      <H2 id="model">The model and the form</H2>
      <p>
        The <strong>model</strong> is plain data in a Solid store, and stays the single source of truth.{' '}
        <code>form(model, setModel, schema?)</code> returns the <strong>field tree</strong>: an object that mirrors the model,
        where every node is a field with its own state. The schema function attaches rules to paths (<code>p.email</code>) and
        runs once.
      </p>
      <p>
        Call <code>form()</code> in a component body. Like <code>createStore</code> and <code>createMemo</code>, it lives under
        the current owner and is cleaned up with it; there is no <code>dispose</code>.
      </p>
      <Example component={Usage} code={usageCode} />
      <p>
        Errors appear once a field is touched (left once), or when <code>submit</code> touches everything. A pristine form shows
        none.
      </p>

      <H2 id="tree">Navigating the tree</H2>
      <p>
        Navigate by property access: <code>f.address.street</code>, <code>f.items[0].sku</code>. Any model key is a valid step,
        and the types follow the model. The root is itself a field over the whole model, so <code>f.$valid()</code> is the form's
        validity. A field over a primitive is a <em>leaf</em>; one over an object or array is a <em>container</em> and also
        reports state aggregated from its descendants.
      </p>

      <H2 id="field-state">Field state</H2>
      <p>
        A field's own state is read through <code>$</code>-prefixed accessors, each a signal. The prefix keeps state apart from
        navigation, so a model key called <code>value</code> or <code>errors</code> is fine. A model key that itself starts with{' '}
        <code>$</code> would collide with the accessors, so avoid those.
      </p>
      <Example component={FieldState} code={fieldStateCode} />
      <DocTable head={['Accessor', 'Meaning']} rows={STATE.map(([name, meaning]) => [<code>{name}</code>, meaning])} />

      <H2 id="notes">Notes</H2>
      <ul>
        <li>
          Write with <code>$set</code> or a binding's handler, from an event handler or an effect, never while rendering: Solid
          forbids writes in an owned scope.
        </li>
        <li>
          <code>form()</code> at module scope has no owner and leaks. Create it inside a component, or inside{' '}
          <code>createRoot</code>.
        </li>
        <li>The model is a store, so arrays change with the store setter (push, splice) and fields follow by index.</li>
      </ul>

      <H2 id="next">Next</H2>
      <ul>
        <li>
          <a href="/forms/binding">Binding</a>: <code>bind()</code> for slopkit inputs, <code>control()</code> for native ones.
        </li>
        <li>
          <a href="/forms/validation">Validation</a>, <a href="/forms/conditions">Conditions and combinators</a>,{' '}
          <a href="/forms/submit">Submit and async</a>, <a href="/forms/metadata">Metadata</a>.
        </li>
      </ul>
    </article>
  );
}
