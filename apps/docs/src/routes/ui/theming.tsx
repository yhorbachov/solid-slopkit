import { For } from 'solid-js';
import { Title } from '@solidjs/meta';
import { CodeBlock } from '../../components/CodeBlock';
import { H2 } from '../../components/Heading';
import { CssVarsTable } from '../../components/PropsTable';

const surfaces = ['base-100', 'base-200', 'base-300'];
const colors = ['neutral', 'primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'];

export default function Theming() {
  return (
    <article class="docs-page">
      <Title>Theming · slopkit</Title>
      <p class="docs-eyebrow">UI</p>
      <h1>Theming</h1>
      <p class="docs-lead">
        A theme is a set of CSS variables. Components only read these tokens, so changing them restyles everything.
      </p>

      <H2 id="colors">Colors</H2>
      <p>
        Every color comes with a <code>-content</code> pair: the text color to use on top of it. Components derive their soft,
        outline and hover tints from these with <code>color-mix()</code>, so a theme only defines the solid values.
      </p>
      <div class="docs-swatches">
        <For each={[...surfaces, ...colors]}>
          {(name) => (
            <div class="docs-swatch">
              <div
                class="docs-swatch-color"
                style={{
                  background: `var(--slp-color-${name})`,
                  color: `var(--slp-color-${name.startsWith('base') ? 'base' : name}-content)`,
                }}
              >
                Aa
              </div>
              <code>--slp-color-{name}</code>
            </div>
          )}
        </For>
      </div>

      <H2 id="tokens">Other tokens</H2>
      <CssVarsTable
        rows={[
          { name: '--slp-radius-field', default: '1rem', description: 'Corner radius of buttons and inputs.' },
          { name: '--slp-radius-box', default: '1rem', description: 'Corner radius of cards and dialogs.' },
          { name: '--slp-radius-selector', default: '0.25rem', description: 'Corner radius of checkboxes and toggles.' },
          {
            name: '--slp-size-field',
            default: '0.25rem',
            description: 'Base unit for control heights. A medium button is 10 units tall.',
          },
          { name: '--slp-border', default: '1px', description: 'Border width.' },
          { name: '--slp-depth', default: '0', description: 'Set to 1 for subtle shadows and highlights on controls.' },
        ]}
      />

      <H2 id="customizing">Customizing</H2>
      <p>
        Override tokens in your own CSS. Theme values live in the <code>slopkit.themes</code> layer, so any unlayered rule wins.
        Scope the overrides to a selector to theme only part of the page.
      </p>
      <CodeBlock
        lang="css"
        code={`:root {
  --slp-color-primary: #7048e8;
  --slp-color-primary-content: #ffffff;
  --slp-radius-field: 0.5rem;
  --slp-depth: 1;
}

.compact {
  --slp-size-field: 0.2rem;
}`}
      />

      <H2 id="palettes">Palettes</H2>
      <p>
        <code>slopkit.css</code> also defines 14 named palettes with 10 shades each, from <code>--slp-gray-0</code> to{' '}
        <code>--slp-orange-9</code>, for use in your own styles and themes.
      </p>
    </article>
  );
}
