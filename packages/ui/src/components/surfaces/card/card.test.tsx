import { render } from '@solidjs/testing-library';
import { captureArtifact } from '@solidjs/diagnostics';
import { createSignal, flush } from 'solid-js';
import axe from 'axe-core';
import { describe, expect, test } from 'vitest';
import { expectHydration } from '../../../../test/ssr';
import { NO_DIAGNOSTICS } from '../../../../test/diagnostics';
import { Card, type CardOrientation, type CardVariant } from './card';

const IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'/%3E";

describe('<Card />', () => {
  test('renders a div with its defaults', () => {
    const { getByText } = render(() => <Card>Content</Card>);
    const card = getByText('Content');

    expect(card.tagName).toBe('DIV');
    expect(card).toHaveClass('slp-card');
    expect(card).toHaveAttribute('data-variant', 'outline');
    expect(card).toHaveAttribute('data-orientation', 'vertical');
  });

  test('renders its parts with their own root classes, and passes props through', () => {
    const { getByRole, getByText } = render(() => (
      <Card variant="soft" orientation="horizontal" role="article" aria-label="Trip" class="mine">
        <Card.Image src={IMAGE} alt="Fjord" class="cover" />
        <Card.Header id="h">Header</Card.Header>
        <Card.Body>Body</Card.Body>
        <Card.Footer>Footer</Card.Footer>
      </Card>
    ));
    const card = getByRole('article', { name: 'Trip' });

    expect(card).toHaveClass('slp-card', 'mine');
    expect(card).toHaveAttribute('data-variant', 'soft');
    expect(card).toHaveAttribute('data-orientation', 'horizontal');
    expect(getByRole('img', { name: 'Fjord' })).toHaveClass('slp-card-image', 'cover');
    expect(getByRole('img', { name: 'Fjord' })).toHaveAttribute('src', IMAGE);
    expect(getByText('Header')).toHaveClass('slp-card-header');
    expect(getByText('Header')).toHaveAttribute('id', 'h');
    expect(getByText('Body')).toHaveClass('slp-card-body');
    expect(getByText('Footer')).toHaveClass('slp-card-footer');
  });

  test('changing variant and orientation updates attributes without diagnostics or waste', async () => {
    const [variant, setVariant] = createSignal<CardVariant>('outline', { name: 'variant' });
    const [orientation, setOrientation] = createSignal<CardOrientation>('vertical', { name: 'orientation' });
    const { getByText } = render(() => (
      <Card variant={variant()} orientation={orientation()}>
        Content
      </Card>
    ));
    flush();
    const card = getByText('Content');

    const { artifact } = await captureArtifact(
      () => {
        setVariant('elevated');
        setOrientation('horizontal');
      },
      { scenario: 'card-props' },
    );

    expect(card).toHaveAttribute('data-variant', 'elevated');
    expect(card).toHaveAttribute('data-orientation', 'horizontal');
    expect(artifact).toHaveNoDiagnostics(NO_DIAGNOSTICS);
    expect(artifact).toHaveNoWaste();
    expect(artifact).toStayWithinRerunBudget(2);
  });

  test('has no axe violations', async () => {
    const { container } = render(() => (
      <>
        <Card>
          <Card.Image src={IMAGE} alt="Fjord at dawn" />
          <Card.Header>
            <h3>Norway</h3>
          </Card.Header>
          <Card.Body>
            <p>Fjords and mountains.</p>
          </Card.Body>
          <Card.Footer>
            <button type="button">Book</button>
          </Card.Footer>
        </Card>
        <Card variant="elevated" orientation="horizontal">
          <Card.Image src={IMAGE} alt="" />
          <Card.Body>
            <p>Decorative image</p>
          </Card.Body>
        </Card>
      </>
    ));

    const results = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toEqual([]);
  });

  test('hydrates the server render without mismatches or diagnostics', async () => {
    await expectHydration('./card.fixtures.tsx', 'parts');
  });
});
