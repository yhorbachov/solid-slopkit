import { fireEvent, render } from '@solidjs/testing-library';
import { captureArtifact } from '@solidjs/diagnostics';
import { createSignal, flush, For } from 'solid-js';
import axe from 'axe-core';
import { describe, expect, test, vi } from 'vitest';
import { expectHydration } from '../../../../test/ssr';
import { NO_DIAGNOSTICS } from '../../../../test/diagnostics';
import { Pill } from './pill';

describe('<Pill />', () => {
  test('renders a span with its root class and the label, md, without a remove button', () => {
    const { getByText, queryByRole } = render(() => <Pill class="mine">Apple</Pill>);
    const label = getByText('Apple');
    const pill = label.parentElement!;

    expect(pill.tagName).toBe('SPAN');
    expect(pill).toHaveClass('slp-pill', 'mine');
    expect(pill).toHaveAttribute('data-size', 'md');
    expect(pill).not.toHaveAttribute('data-with-remove');
    expect(label).toHaveAttribute('data-slot', 'pill-label');
    expect(queryByRole('button')).toBeNull();
  });

  test('the remove button is named after the pill and calls onRemove', () => {
    const onRemove = vi.fn();
    const { getByRole, getByText } = render(() => (
      <Pill withRemoveButton onRemove={onRemove}>
        Apple
      </Pill>
    ));
    const button = getByRole('button', { name: 'Remove Apple' });

    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('data-slot', 'pill-remove');
    expect(getByText('Apple').parentElement).toHaveAttribute('data-with-remove', '');
    fireEvent.click(button);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  test('removeLabel changes the first word of the name', () => {
    const { getByRole } = render(() => (
      <Pill withRemoveButton removeLabel="Delete">
        Apple
      </Pill>
    ));

    expect(getByRole('button', { name: 'Delete Apple' })).toBeDefined();
  });

  test('disabled dims it and disables the remove button', () => {
    const onRemove = vi.fn();
    const { getByRole, getByText } = render(() => (
      <Pill withRemoveButton disabled onRemove={onRemove}>
        Apple
      </Pill>
    ));

    expect(getByText('Apple').parentElement).toHaveAttribute('data-disabled', '');
    expect(getByRole('button')).toBeDisabled();
  });

  test('Pill.Group lays them out, and passes its size and disabled down; a pill can override the size', () => {
    const { getByText, getByTestId } = render(() => (
      <Pill.Group data-testid="group" size="sm" disabled class="mine">
        <Pill>One</Pill>
        <Pill size="xl">Two</Pill>
      </Pill.Group>
    ));

    expect(getByTestId('group').tagName).toBe('DIV');
    expect(getByTestId('group')).toHaveClass('slp-pill-group', 'mine');
    expect(getByTestId('group')).toHaveAttribute('data-size', 'sm');
    expect(getByText('One').parentElement).toHaveAttribute('data-size', 'sm');
    expect(getByText('One').parentElement).toHaveAttribute('data-disabled', '');
    expect(getByText('Two').parentElement).toHaveAttribute('data-size', 'xl');
  });

  test('has no axe violations, with and without a remove button, enabled and disabled', async () => {
    const { container } = render(() => (
      <Pill.Group>
        <Pill>Plain</Pill>
        <Pill withRemoveButton>Removable</Pill>
        <Pill withRemoveButton disabled>
          Disabled
        </Pill>
      </Pill.Group>
    ));

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });

  test('removing a pill from a list has no diagnostics or waste', async () => {
    const [items, setItems] = createSignal(['Apple', 'Banana', 'Cherry']);
    const { getByRole } = render(() => (
      <Pill.Group>
        <For each={items()}>
          {(item) => (
            <Pill withRemoveButton onRemove={() => setItems((list) => list.filter((other) => other !== item))}>
              {item}
            </Pill>
          )}
        </For>
      </Pill.Group>
    ));

    const { artifact } = await captureArtifact(
      () => {
        fireEvent.click(getByRole('button', { name: 'Remove Banana' }));
        flush();
      },
      { scenario: 'pill-remove' },
    );

    expect(artifact).toHaveNoDiagnostics(NO_DIAGNOSTICS);
    expect(artifact).toHaveNoWaste();
  });

  test('hydrates the server render without mismatches or diagnostics', async () => {
    await expectHydration('./pill.fixtures.tsx', 'pills');
  });
});
