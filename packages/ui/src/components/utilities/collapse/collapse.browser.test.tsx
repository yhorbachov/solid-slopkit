import { render } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { describe, expect, test, vi } from 'vitest';
import { Collapse, type CollapseProps } from './collapse';

function setup(initial: boolean, props: Partial<Omit<CollapseProps, 'expanded'>> = {}) {
  const [expanded, setExpanded] = createSignal(initial);
  const [lines, setLines] = createSignal(3);
  const result = render(() => (
    <Collapse expanded={expanded()} data-testid="collapse" duration={600} timingFunction="linear" {...props}>
      <div style={{ height: `${lines() * 20}px` }}>Content</div>
    </Collapse>
  ));
  const collapse = result.getByTestId('collapse');
  const toggle = (value: boolean) => {
    setExpanded(value);
    flush();
  };
  const height = () => Math.round(collapse.getBoundingClientRect().height);
  return { ...result, collapse, toggle, height, setLines };
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('<Collapse /> in a browser', () => {
  test('expanding animates the height from zero to the content, then lets it grow', async () => {
    const onExpanded = vi.fn();
    const { collapse, toggle, height, setLines } = setup(false, { onExpanded });

    toggle(true);
    expect(height()).toBe(0);
    // Partway, rather than straight to the full height.
    await expect.poll(() => height() > 0 && height() < 60).toBe(true);

    await expect.poll(() => onExpanded.mock.calls.length, { timeout: 3000 }).toBe(1);
    expect(height()).toBe(60);
    expect(collapse.style.height).toBe('');
    expect(collapse.style.overflow).toBe('');

    setLines(5);
    flush();
    expect(height()).toBe(100);
  });

  test('collapsing animates down to zero, then hides it', async () => {
    const onCollapsed = vi.fn();
    const { collapse, toggle, height } = setup(true, { onCollapsed });
    expect(height()).toBe(60);

    toggle(false);
    expect(collapse).toHaveAttribute('data-status', 'ending');
    await expect.poll(() => height() > 0 && height() < 60).toBe(true);

    await expect.poll(() => onCollapsed.mock.calls.length, { timeout: 3000 }).toBe(1);
    expect(collapse).toHaveAttribute('data-status', 'closed');
    expect(getComputedStyle(collapse).display).toBe('none');
    expect(collapse.style.height).toBe('');
  });

  test('reversing midway goes back from where it is, and ends at the content height', async () => {
    const { collapse, toggle, height } = setup(true);

    toggle(false);
    await wait(150);
    const midway = height();
    toggle(true);
    expect(height()).toBe(midway);

    await expect.poll(() => collapse.style.height, { timeout: 3000 }).toBe('');
    expect(height()).toBe(60);
    expect(collapse).toHaveAttribute('data-status', 'open');
  });

  test('fades with the height, unless animateOpacity is off', async () => {
    const fading = setup(false);
    fading.toggle(true);
    expect(getComputedStyle(fading.collapse).opacity).toBe('0');
    fading.unmount();

    const solid = setup(false, { animateOpacity: false });
    solid.toggle(true);
    expect(getComputedStyle(solid.collapse).opacity).toBe('1');
  });

  test('collapsed content is out of the tab order', () => {
    const { getByText } = render(() => (
      <Collapse expanded={false}>
        <button>Hidden</button>
      </Collapse>
    ));

    getByText('Hidden').focus();

    expect(getByText('Hidden')).not.toHaveFocus();
  });

  // In a reversed column, the button (first in the DOM) is the one below the Collapse, which moves. In a block, the
  // content's margins would collapse through the Collapse until it clips them.
  test.each([
    ['a column flexbox with a gap', { display: 'flex', 'flex-direction': 'column', gap: '16px' }, 'after', 16],
    ['a reversed column with a gap', { display: 'flex', 'flex-direction': 'column-reverse', gap: '16px' }, 'before', 16],
    ['a block', { display: 'block' }, 'after', 0],
  ] as const)('in %s, nothing jumps when it starts, hides, shows or settles', async (_, parentStyle, below, gap) => {
    const [expanded, setExpanded] = createSignal(true);
    const { getByTestId } = render(() => (
      <div style={parentStyle}>
        <button data-testid="before">Toggle</button>
        <Collapse expanded={expanded()} duration={400} timingFunction="linear" data-testid="collapse">
          {/* A paragraph's own margins, which would collapse through an unclipped parent. */}
          <p style={{ margin: '16px 0', height: '32px' }}>Content</p>
        </Collapse>
        <p data-testid="after" style={{ margin: 0 }}>
          After
        </p>
      </div>
    ));
    const collapse = getByTestId('collapse');
    const position = () => Math.round(getByTestId(below).getBoundingClientRect().top);
    const expandedAt = position();

    // Starting to collapse clips the content and pins the height: nothing moves yet.
    setExpanded(false);
    flush();
    expect(position()).toBe(expandedAt);

    // At height zero, still shown, it takes no room: hiding it moves nothing.
    await expect.poll(() => collapse.getBoundingClientRect().height, { timeout: 3000 }).toBe(0);
    const zeroAt = position();
    await expect.poll(() => collapse.getAttribute('data-status'), { timeout: 3000 }).toBe('closed');
    expect(position()).toBe(zeroAt);
    // Content and its margins (32 + 16 + 16), and the gap.
    expect(Math.abs(zeroAt - expandedAt)).toBe(64 + gap);

    // Showing it again, at height zero for a frame, moves nothing either.
    setExpanded(true);
    flush();
    expect(position()).toBe(zeroAt);

    // Once it has grown, clearing the measured height moves nothing.
    await expect.poll(() => position(), { timeout: 3000 }).toBe(expandedAt);
    await expect.poll(() => collapse.style.height, { timeout: 3000 }).toBe('');
    expect(position()).toBe(expandedAt);
  });

  test('in a grid, the gap goes when it is hidden: a grid row cannot shrink below zero', async () => {
    const [expanded, setExpanded] = createSignal(true);
    const { getByTestId } = render(() => (
      <div style={{ display: 'grid', gap: '16px' }}>
        <button>Toggle</button>
        <Collapse expanded={expanded()} duration={100} data-testid="collapse">
          <p style={{ margin: 0, height: '32px' }}>Content</p>
        </Collapse>
        <p data-testid="after" style={{ margin: 0 }}>
          After
        </p>
      </div>
    ));
    const before = getByTestId('after').getBoundingClientRect().top;

    setExpanded(false);
    flush();

    await expect.poll(() => getByTestId('collapse').getAttribute('data-status'), { timeout: 3000 }).toBe('closed');
    expect(Math.round(before - getByTestId('after').getBoundingClientRect().top)).toBe(48);
    expect(getByTestId('collapse').style.marginBottom).toBe('');
  });
});
