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
    await expect.poll(() => collapse.getAttribute('data-status')).toBe('open');
    await wait(150);
    expect(height()).toBeGreaterThan(0);
    expect(height()).toBeLessThan(60);

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
    await wait(150);
    expect(height()).toBeGreaterThan(0);
    expect(height()).toBeLessThan(60);

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
});
