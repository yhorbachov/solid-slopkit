import { render } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { describe, expect, test } from 'vitest';
import { SlopkitUi } from '../../provider';
import { resolveStyleClass } from '../../../style-props';
import { Center } from './center';

const flexClass = (props: Parameters<typeof resolveStyleClass>[0]) => resolveStyleClass(props, 'flex')!.className;

describe('<Center />', () => {
  test('is a flex that centers both ways, and passes other props to the div', () => {
    const { getByTestId } = render(() => (
      <SlopkitUi>
        <Center data-testid="c" class="mine" id="c" />
      </SlopkitUi>
    ));
    flush();
    const center = getByTestId('c');

    expect(center).toHaveClass('slp-flex', 'slp-center', 'mine');
    expect(center).toHaveClass(flexClass({ display: 'flex', align: 'center', justify: 'center' }));
    expect(center).toHaveAttribute('id', 'c');
  });

  test('inline switches to inline-flex', () => {
    const [inline, setInline] = createSignal(false);
    const { getByTestId } = render(() => (
      <SlopkitUi>
        <Center data-testid="c" inline={inline()} />
      </SlopkitUi>
    ));
    flush();
    const center = getByTestId('c');

    setInline(true);
    flush();
    expect(center).toHaveClass(flexClass({ display: 'inline-flex', align: 'center', justify: 'center' }));
    expect(center).not.toHaveAttribute('inline');
  });
});
