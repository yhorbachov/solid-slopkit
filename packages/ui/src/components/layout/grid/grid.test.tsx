import { render } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { captureArtifact } from '@solidjs/diagnostics';
import { describe, expect, test } from 'vitest';
import { SlopkitUi } from '../../provider';
import { resolveStyleClass, resolveStyleProps } from '../../../style-props';
import { Grid } from './grid';

const maxWidth = (span: number) => `max(${width(span)},var(--_grid-grow) * 100%)`;
const width = (span: number) => `calc((100% + var(--_grid-gutter)) * ${span} / var(--_grid-columns) - var(--_grid-gutter))`;

describe('<Grid />', () => {
  test('defaults to 12 columns and a gutter of 4', () => {
    expect(resolveStyleProps({}, 'grid')).toEqual({
      base: ['--_grid-gutter:calc(var(--slp-spacing) * 4)', '--_grid-columns:12'],
    });
  });

  test('gutter is responsive, columns are a plain count', () => {
    expect(resolveStyleProps({ gutter: { base: 2, md: 6 }, columns: 24, justify: 'center' }, 'grid')).toEqual({
      base: ['--_grid-gutter:calc(var(--slp-spacing) * 2)', '--_grid-columns:24', 'justify-content:center'],
      md: ['--_grid-gutter:calc(var(--slp-spacing) * 6)'],
    });
  });

  test('renders a div with the grid classes and passes other props through', () => {
    const { getByTestId } = render(() => (
      <SlopkitUi>
        <Grid data-testid="grid" gutter={2} grow class="mine" id="g" />
      </SlopkitUi>
    ));
    flush();
    const grid = getByTestId('grid');

    expect(grid).toHaveClass('slp-grid', 'mine', resolveStyleClass({ gutter: 2 }, 'grid')!.className);
    expect(grid).toHaveAttribute('data-grow', '');
    expect(grid).toHaveAttribute('id', 'g');
    expect(grid).not.toHaveAttribute('gutter');
  });
});

describe('<Grid.Col />', () => {
  test('defaults to the full row, growing when the grid grows', () => {
    expect(resolveStyleProps({}, 'gridCol')).toEqual({
      base: ['flex-basis:100%', 'flex-grow:var(--_grid-grow)', 'max-width:100%'],
    });
  });

  test('span is a share of the columns minus the gutters it does not cover, per breakpoint', () => {
    expect(resolveStyleProps({ span: { base: 12, md: 6, lg: 'auto' }, offset: { md: 3 }, order: 2 }, 'gridCol')).toEqual({
      base: [`flex-basis:${width(12)}`, 'flex-grow:var(--_grid-grow)', `max-width:${maxWidth(12)}`, 'order:2'],
      md: [
        `flex-basis:${width(6)}`,
        `max-width:${maxWidth(6)}`,
        'margin-inline-start:calc((100% + var(--_grid-gutter)) * 3 / var(--_grid-columns))',
      ],
      lg: ['flex-basis:0', 'flex-grow:1', 'max-width:100%'],
    });
  });

  test('span="content" fits the content and never grows', () => {
    expect(resolveStyleProps({ span: 'content' }, 'gridCol')).toEqual({
      base: ['flex-basis:auto', 'flex-grow:0', 'max-width:100%'],
    });
  });

  test('changing span swaps the class without diagnostics or waste', async () => {
    const [span, setSpan] = createSignal(6, { name: 'span' });
    const { getByTestId } = render(() => (
      <SlopkitUi>
        <Grid>
          <Grid.Col data-testid="col" span={span()} />
        </Grid>
      </SlopkitUi>
    ));
    flush();
    const col = getByTestId('col');

    const { artifact } = await captureArtifact(() => setSpan(4), { scenario: 'grid-col-span' });

    expect(col).toHaveClass('slp-grid-col', resolveStyleClass({ span: 4 }, 'gridCol')!.className);
    expect(artifact).toHaveNoDiagnostics();
    expect(artifact).toHaveNoWaste();
  });
});
