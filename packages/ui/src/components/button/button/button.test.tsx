import { render, fireEvent } from '@solidjs/testing-library';
import { captureArtifact } from '@solidjs/diagnostics';
import { createSignal, flush } from 'solid-js';
import axe from 'axe-core';
import { describe, expect, test, vi } from 'vitest';
import type { SlopColor, SlopSize } from '../../../core';
import { Button, type ButtonVariant } from './button';

describe('<Button />', () => {
  test('renders a native button with defaults', () => {
    const { getByRole } = render(() => <Button>Save</Button>);
    const button = getByRole('button', { name: 'Save' });

    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('data-variant', 'solid');
    expect(button).toHaveAttribute('data-size', 'md');
    expect(button).toHaveAttribute('data-shape', 'default');
    expect(button).not.toHaveAttribute('data-color');
    expect(button).not.toHaveAttribute('role');
    expect(button).not.toHaveAttribute('tabindex');
  });

  test('reflects style props as data attributes', () => {
    const { getByRole } = render(() => (
      <Button variant="outline" color="primary" size="xs" shape="circle" fullWidth active aria-label="Add" />
    ));
    const button = getByRole('button', { name: 'Add' });

    expect(button).toHaveAttribute('data-variant', 'outline');
    expect(button).toHaveAttribute('data-color', 'primary');
    expect(button).toHaveAttribute('data-size', 'xs');
    expect(button).toHaveAttribute('data-shape', 'circle');
    expect(button).toHaveAttribute('data-full-width', '');
    expect(button).toHaveAttribute('data-active', '');
  });

  test('as="a" with href stays a link', () => {
    const { getByRole } = render(() => (
      <Button as="a" href="/docs">
        Docs
      </Button>
    ));
    flush();
    const link = getByRole('link', { name: 'Docs' });

    expect(link.tagName).toBe('A');
    expect(link).not.toHaveAttribute('role');
    expect(link).not.toHaveAttribute('type');
    expect(link).not.toHaveAttribute('tabindex');
  });

  test('as="div" gets button semantics', () => {
    const { getByRole } = render(() => <Button as="div">Div</Button>);
    flush();
    const button = getByRole('button', { name: 'Div' });

    expect(button.tagName).toBe('DIV');
    expect(button).toHaveAttribute('tabindex', '0');
    expect(button).not.toHaveAttribute('type');
    expect(button).not.toHaveAttribute('disabled');
  });

  test('disabled blocks clicks', () => {
    const onClick = vi.fn();
    const { getByRole } = render(() => (
      <Button disabled onClick={onClick}>
        Save
      </Button>
    ));
    const button = getByRole('button', { name: 'Save' });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('data-disabled', '');
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  test('loading blocks clicks without the disabled look', () => {
    const onClick = vi.fn();
    const { getByRole } = render(() => (
      <Button loading onClick={onClick}>
        Save
      </Button>
    ));
    const button = getByRole('button', { name: 'Save' });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('data-loading', '');
    expect(button).not.toHaveAttribute('data-disabled');
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  test('disabled custom element uses aria-disabled and leaves the tab order', () => {
    const { getByRole } = render(() => (
      <Button as="div" disabled>
        Div
      </Button>
    ));
    flush();
    const button = getByRole('button', { name: 'Div' });

    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toHaveAttribute('data-disabled', '');
    expect(button).not.toHaveAttribute('tabindex');
  });

  test('style prop changes update attributes without diagnostics or waste', async () => {
    const [variant, setVariant] = createSignal<ButtonVariant>('solid', { name: 'variant' });
    const [color, setColor] = createSignal<SlopColor>('neutral', { name: 'color' });
    const [size, setSize] = createSignal<SlopSize>('md', { name: 'size' });
    const { getByRole } = render(() => (
      <Button variant={variant()} color={color()} size={size()}>
        Save
      </Button>
    ));
    flush();
    const button = getByRole('button', { name: 'Save' });

    const { artifact } = await captureArtifact(
      () => {
        setVariant('ghost');
        setColor('error');
        setSize('lg');
      },
      { scenario: 'button-style-props' },
    );

    expect(button).toHaveAttribute('data-variant', 'ghost');
    expect(button).toHaveAttribute('data-color', 'error');
    expect(button).toHaveAttribute('data-size', 'lg');
    expect(artifact).toHaveNoDiagnostics();
    expect(artifact).toHaveNoWaste();
    expect(artifact).toStayWithinRerunBudget(3);
  });

  test('has no axe violations', async () => {
    const { container } = render(() => (
      <>
        <Button>Text</Button>
        <Button color="primary" variant="outline" disabled>
          Disabled
        </Button>
        <Button loading>Loading</Button>
        <Button shape="circle" aria-label="Add">
          <svg viewBox="0 0 24 24" aria-hidden="true" />
        </Button>
        <Button as="a" href="/docs">
          Link
        </Button>
      </>
    ));
    flush();

    const results = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toEqual([]);
  });
});
