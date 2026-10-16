import { defineConfig } from 'vitest/config';
import solid from '@solidjs/vite-plugin';
import { fileURLToPath } from 'node:url';

// The package ships uncompiled Solid source (see `build:source`); this config only serves the tests. The binding
// tests render the real @solid-slopkit/ui inputs from source: no build step, and no runtime dependency on ui.
const uiSource = fileURLToPath(new URL('../ui/src/index.ts', import.meta.url));

// Budget files run alone, after the unit project: diagnostics include wall-clock checks that trip on a busy machine.
export default defineConfig({
  plugins: [solid({ ssr: true })],
  resolve: { alias: { '@solid-slopkit/ui': uiSource } },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          include: ['src/**/*.test.{ts,tsx}', 'test/**/*.test.ts'],
          exclude: ['**/*.budget.test.*'],
          setupFiles: ['./test/setup.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'budget',
          environment: 'jsdom',
          include: ['src/**/*.budget.test.{ts,tsx}'],
          setupFiles: ['./test/setup.ts'],
          fileParallelism: false,
          sequence: { groupOrder: 1 },
        },
      },
    ],
  },
});
