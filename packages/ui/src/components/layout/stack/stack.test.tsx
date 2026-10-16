import { render } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { captureArtifact } from '@solidjs/diagnostics';
import axe from 'axe-core';
import { describe, expect, test } from 'vitest';
import { SlopkitUi } from '../../provider';
import { resolveStyleClass, type FlexAlign } from '../../../style-props';
import { expectHydration } from '../../../../test/ssr';
import { Stack } from './stack';
import { NO_DIAGNOSTICS } from '../../../../test/diagnostics';

const flexClass = (props: Parameters<typeof resolveStyleClass>[0]) => resolveStyleClass(props, 'flex')!.className;

describe('<Stack />', () => {
  test('is a column flex with its default gap and alignment', () => {
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

  test('divided marks the root and passes the gap to its CSS, keeping the style it is given', () => {
    const { getByTestId } = render(() => (
      <SlopkitUi>
        <Stack data-testid="plain" />
        <Stack data-testid="divided" divided gap={2} style={{ color: 'red' }} />
      </SlopkitUi>
    ));
    flush();
    const plain = getByTestId('plain');
    const divided = getByTestId('divided');

    expect(plain).not.toHaveAttribute('data-divided');
    expect(plain.style.getPropertyValue('--_stack-gap')).toBe('');
    expect(divided).toHaveAttribute('data-divided', '');
    expect(divided.style.getPropertyValue('--_stack-gap')).toBe('calc(var(--slp-spacing) * 2)');
    expect(divided.style.color).toBe('red');
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

  test('changing gap and align swaps the class without diagnostics or waste', async () => {
    const [gap, setGap] = createSignal(4, { name: 'gap' });
    const [align, setAlign] = createSignal<FlexAlign>('stretch', { name: 'align' });
    const { getByTestId } = render(() => (
      <SlopkitUi>
        <Stack data-testid="stack" gap={gap()} align={align()} />
      </SlopkitUi>
    ));
    flush();
    const stack = getByTestId('stack');

    const { artifact } = await captureArtifact(
      () => {
        setGap(8);
        setAlign('center');
      },
      { scenario: 'stack-props' },
    );

    expect(stack).toHaveClass(flexClass({ direction: 'column', gap: 8, align: 'center', justify: 'flex-start' }));
    expect(stack).not.toHaveClass(flexClass({ direction: 'column', gap: 4, align: 'stretch', justify: 'flex-start' }));
    expect(artifact).toHaveNoDiagnostics(NO_DIAGNOSTICS);
    expect(artifact).toHaveNoWaste();
    expect(artifact).toStayWithinRerunBudget(1, { scope: /Flex/ });
  });

  test('has no axe violations', async () => {
    const { container } = render(() => (
      <SlopkitUi>
        <Stack>
          <p>a</p>
          <p>b</p>
        </Stack>
        <Stack role="list" aria-label="Steps" gap={2} align="center">
          <div role="listitem">One</div>
          <div role="listitem">Two</div>
        </Stack>
      </SlopkitUi>
    ));
    flush();

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });

  test('hydrates the server render without mismatches or diagnostics', async () => {
    await expectHydration('./stack.fixtures.tsx', 'defaultsAndProps');
  });
});
