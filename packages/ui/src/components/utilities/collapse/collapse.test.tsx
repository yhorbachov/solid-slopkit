import { render } from '@solidjs/testing-library';
import { captureArtifact } from '@solidjs/diagnostics';
import { createSignal, flush } from 'solid-js';
import axe from 'axe-core';
import { describe, expect, test, vi } from 'vitest';
import { expectHydration } from '../../../../test/ssr';
import { NO_DIAGNOSTICS } from '../../../../test/diagnostics';
import { Collapse, type CollapseProps } from './collapse';

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));
/** Lets the microtasks run that settle a change with nothing to animate. */
const microtasks = async () => {
  for (let i = 0; i < 10; i++) await Promise.resolve();
};

function setup(initial: boolean, props: Partial<Omit<CollapseProps, 'expanded'>> = {}) {
  const [expanded, setExpanded] = createSignal(initial);
  const result = render(() => (
    <Collapse expanded={expanded()} data-testid="collapse" {...props}>
      <p>Content</p>
    </Collapse>
  ));
  const toggle = (value: boolean) => {
    setExpanded(value);
    flush();
  };
  return { ...result, toggle, collapse: () => result.getByTestId('collapse') };
}

describe('<Collapse />', () => {
  test('expanded: a div with the root class, its status and timing, shown', () => {
    const { collapse } = setup(true, { class: 'mine', duration: 300, timingFunction: 'linear' });

    expect(collapse().tagName).toBe('DIV');
    expect(collapse()).toHaveClass('slp-collapse', 'mine');
    expect(collapse()).toHaveAttribute('data-status', 'open');
    expect(collapse()).toHaveAttribute('data-animate-opacity', '');
    expect(collapse().style.display).toBe('');
    expect(collapse().style.getPropertyValue('--_collapse-duration')).toBe('300ms');
    expect(collapse().style.getPropertyValue('--_collapse-timing-function')).toBe('linear');
  });

  test('collapsed: stays in the DOM with display: none', () => {
    const { collapse, getByText } = setup(false, { animateOpacity: false });

    expect(collapse()).toHaveAttribute('data-status', 'closed');
    expect(collapse().style.display).toBe('none');
    expect(collapse()).not.toHaveAttribute('data-animate-opacity');
    expect(getByText('Content')).toBeInTheDocument();
  });

  test('expanding and collapsing with nothing to animate, and the callbacks', async () => {
    const onExpanded = vi.fn();
    const onCollapsed = vi.fn();
    const { collapse, toggle } = setup(false, { onExpanded, onCollapsed });

    toggle(true);
    expect(collapse()).toHaveAttribute('data-status', 'starting');
    expect(collapse().style.display).toBe('');
    await nextFrame();
    expect(collapse()).toHaveAttribute('data-status', 'open');
    await microtasks();
    expect(onExpanded).toHaveBeenCalledTimes(1);
    expect(collapse().style.height).toBe('');

    toggle(false);
    await microtasks();
    expect(collapse()).toHaveAttribute('data-status', 'closed');
    expect(collapse().style.display).toBe('none');
    expect(collapse().style.height).toBe('');
    expect(onCollapsed).toHaveBeenCalledTimes(1);
  });

  test("keeps the user's style and ref", () => {
    let ref: HTMLDivElement | undefined;
    const { collapse } = setup(true, { style: { color: 'red' }, ref: (el) => (ref = el) });

    expect(collapse().style.color).toBe('red');
    expect(ref).toBe(collapse());
  });

  test('has no axe violations', async () => {
    const { container } = render(() => (
      <>
        <Collapse expanded>
          <p>Shown</p>
        </Collapse>
        <Collapse expanded={false}>
          <p>Hidden</p>
        </Collapse>
      </>
    ));

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });

  test('expanding and collapsing has no diagnostics or waste', async () => {
    const { toggle } = setup(false);
    flush();

    const { artifact } = await captureArtifact(
      async () => {
        toggle(true);
        await nextFrame();
        await microtasks();
        toggle(false);
        await microtasks();
      },
      { scenario: 'collapse-toggle' },
    );

    expect(artifact).toHaveNoDiagnostics(NO_DIAGNOSTICS);
    // presence.mounted recomputes on each status but only changes on two of them; the other two runs are the only waste.
    expect(artifact).toHaveNoWaste({ maxWastedRuns: 2 });
    // One run per status (starting, open, ending, closed).
    expect(artifact).toStayWithinRerunBudget(4, { scope: /Collapse\.height/ });
  });

  test('hydrates the server render without mismatches or diagnostics', async () => {
    await expectHydration('./collapse.fixtures.tsx', 'collapses');
  });
});
