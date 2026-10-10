import { render } from '@solidjs/testing-library';
import { flush } from 'solid-js';
import { describe, expect, test } from 'vitest';
import { SlopkitUi } from '../../provider';
import { resolveStyleClass } from '../../../style-props';
import { Space } from './space';

describe('<Space />', () => {
  test('renders an empty div sized by w and h', () => {
    const { getByTestId } = render(() => (
      <SlopkitUi>
        <Space data-testid="h" h={4} />
        <Space data-testid="w" w={{ base: 2, md: 8 }} class="mine" />
      </SlopkitUi>
    ));
    flush();
    const vertical = getByTestId('h');
    const horizontal = getByTestId('w');

    expect(vertical).toBeEmptyDOMElement();
    expect(vertical).toHaveClass('slp-space', resolveStyleClass({ h: 4 }, 'size')!.className);
    expect(vertical).not.toHaveAttribute('h');
    expect(horizontal).toHaveClass('slp-space', 'mine', resolveStyleClass({ w: { base: 2, md: 8 } }, 'size')!.className);
  });

  test('without w or h it has no generated class', () => {
    const { getByTestId } = render(() => (
      <SlopkitUi>
        <Space data-testid="s" />
      </SlopkitUi>
    ));
    flush();

    expect(
      getByTestId('s')
        .className.split(' ')
        .filter((name) => name.startsWith('slp-s-')),
    ).toEqual([]);
  });
});
