import { render } from '@solidjs/testing-library';
import { flush } from 'solid-js';
import { describe, expect, test } from 'vitest';
import { SlopkitUi } from '../../provider';
import { resolveStyleClass } from '../../../style-props';
import { Stack } from './stack';

const flexClass = (props: Parameters<typeof resolveStyleClass>[0]) => resolveStyleClass(props, 'flex')!.className;

describe('<Stack />', () => {
  test('is a column flex with Mantine defaults', () => {
    const { getByTestId } = render(() => (
      <SlopkitUi>
        <Stack data-testid="stack" />
      </SlopkitUi>
    ));
    flush();
    const stack = getByTestId('stack');

    expect(stack).toHaveClass('slp-flex', 'slp-stack');
    expect(stack).toHaveClass(flexClass({ direction: 'column', gap: 4, align: 'stretch', justify: 'flex-start' }));
  });

  test('passes gap, align and justify to Flex, and the rest to the div', () => {
    const { getByTestId } = render(() => (
      <SlopkitUi>
        <Stack data-testid="stack" gap={2} align="center" justify="space-between" class="mine" id="s" />
      </SlopkitUi>
    ));
    flush();
    const stack = getByTestId('stack');

    expect(stack).toHaveClass('mine');
    expect(stack).toHaveAttribute('id', 's');
    expect(stack).toHaveClass(flexClass({ direction: 'column', gap: 2, align: 'center', justify: 'space-between' }));
  });
});
