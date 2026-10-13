import { render } from '@solidjs/testing-library';
import axe from 'axe-core';
import { describe, expect, test } from 'vitest';
import { expectHydration } from '../../../../test/ssr';
import { SlopkitUi } from '../../provider';
import { HoverCard } from './hover-card';

describe('<HoverCard />', () => {
  test('closed: only the target, without popup attributes', () => {
    const { getByText, queryByText } = render(() => (
      <SlopkitUi>
        <HoverCard>
          <HoverCard.Target>
            {(target) => (
              <a href="#ada" {...target}>
                @ada
              </a>
            )}
          </HoverCard.Target>
          <HoverCard.Dropdown>Profile</HoverCard.Dropdown>
        </HoverCard>
      </SlopkitUi>
    ));

    expect(getByText('@ada')).not.toHaveAttribute('aria-haspopup');
    expect(getByText('@ada')).not.toHaveAttribute('aria-expanded');
    expect(queryByText('Profile')).toBeNull();
  });

  test('the dropdown: a manual popover with the root class, slot, status and placement', () => {
    const { getByText } = render(() => (
      <SlopkitUi>
        <HoverCard opened withArrow position="left-end" transition="scale">
          <HoverCard.Target>
            {(target) => (
              <a href="#ada" {...target}>
                @ada
              </a>
            )}
          </HoverCard.Target>
          <HoverCard.Dropdown class="mine" style={{ width: '12rem' }} aria-label="Ada's profile">
            Profile
          </HoverCard.Dropdown>
        </HoverCard>
      </SlopkitUi>
    ));
    const dropdown = getByText('Profile');

    expect(dropdown).toHaveAttribute('popover', 'manual');
    expect(dropdown).not.toHaveAttribute('role');
    expect(dropdown).toHaveAttribute('aria-label', "Ada's profile");
    expect(dropdown).toHaveAttribute('data-slot', 'hover-card-dropdown');
    expect(dropdown).toHaveAttribute('data-placement', 'left-end');
    expect(dropdown).toHaveAttribute('data-transition', 'scale');
    expect(dropdown).toHaveAttribute('data-status', 'open');
    expect(dropdown).toHaveClass('slp-hover-card', 'slp-transition', 'mine');
    expect(dropdown.style.width).toBe('12rem');
    expect(dropdown.querySelector('[data-slot="hover-card-arrow"]')).not.toBeNull();
  });

  test('its parts throw outside a HoverCard, and HoverCard throws outside the provider', () => {
    expect(() => render(() => <HoverCard.Dropdown>Profile</HoverCard.Dropdown>)).toThrow(
      '<HoverCard.Dropdown> must be rendered inside <HoverCard>.',
    );
    expect(() =>
      render(() => (
        <HoverCard>
          <HoverCard.Target>
            {(target) => (
              <a href="#ada" {...target}>
                @ada
              </a>
            )}
          </HoverCard.Target>
        </HoverCard>
      )),
    ).toThrow('<HoverCard> must be rendered inside <SlopkitUi>.');
  });

  test('has no axe violations, open', async () => {
    const { container } = render(() => (
      <SlopkitUi>
        <HoverCard opened withArrow>
          <HoverCard.Target>
            {(target) => (
              <a href="#ada" {...target}>
                @ada
              </a>
            )}
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <p>Ada Lovelace</p>
            <a href="#follow">Follow</a>
          </HoverCard.Dropdown>
        </HoverCard>
      </SlopkitUi>
    ));

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });

  test.each(['closed', 'open'])('hydrates the %s server render without mismatches or diagnostics', async (name) => {
    await expectHydration('./hover-card.fixtures.tsx', name);
  });
});
