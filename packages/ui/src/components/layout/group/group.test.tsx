import { render } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { describe, expect, test } from 'vitest';
import { SlopkitUi } from '../../provider';
import { resolveStyleClass } from '../../../style-props';
import { Group } from './group';

const flexClass = (props: Parameters<typeof resolveStyleClass>[0]) => resolveStyleClass(props, 'flex')!.className;

describe('<Group />', () => {
  test('is a wrapping row flex with Mantine defaults', () => {
    const { getByTestId } = render(() => (
      <SlopkitUi>
        <Group data-testid="group" />
      </SlopkitUi>
    ));
    flush();
    const group = getByTestId('group');

    expect(group).toHaveClass('slp-flex', 'slp-group');
    expect(group).toHaveClass(flexClass({ gap: 4, align: 'center', justify: 'flex-start', wrap: 'wrap' }));
    expect(group).not.toHaveAttribute('data-grow');
    expect(group).toHaveAttribute('data-prevent-grow-overflow', '');
  });

  test('passes its props to Flex, and the rest to the div', () => {
    const { getByTestId } = render(() => (
      <SlopkitUi>
        <Group data-testid="group" gap={1} align="start" justify="end" wrap="nowrap" class="mine" id="g" />
      </SlopkitUi>
    ));
    flush();
    const group = getByTestId('group');

    expect(group).toHaveClass('mine');
    expect(group).toHaveAttribute('id', 'g');
    expect(group).toHaveClass(flexClass({ gap: 1, align: 'start', justify: 'end', wrap: 'nowrap' }));
  });

  test('grow and preventGrowOverflow are data attributes and update', () => {
    const [grow, setGrow] = createSignal(false);
    const [prevent, setPrevent] = createSignal(true);
    const { getByTestId } = render(() => (
      <SlopkitUi>
        <Group data-testid="group" grow={grow()} preventGrowOverflow={prevent()} />
      </SlopkitUi>
    ));
    flush();
    const group = getByTestId('group');

    setGrow(true);
    setPrevent(false);
    flush();
    expect(group).toHaveAttribute('data-grow', '');
    expect(group).not.toHaveAttribute('data-prevent-grow-overflow');
  });
});
