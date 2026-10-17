import { defineConfig } from 'vitest/config';
import solid from '@solidjs/vite-plugin';
import { playwright } from '@vitest/browser-playwright';

// The package ships uncompiled Solid source (see `build:source`); this config only serves the tests.
export default defineConfig({
  plugins: [solid({ ssr: true })],
  test: {
    projects: [
      {
        // The scene graph and reactivity against a stub renderer: fast, no GPU and no layout.
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          include: ['src/**/*.test.{ts,tsx}', 'test/**/*.test.{ts,tsx}'],
          exclude: ['**/*.browser.test.*'],
          setupFiles: ['./test/setup.ts', './test/jsdom-setup.ts'],
          // An SSR test's first render starts the helper's own Vite server (test/ssr.tsx), once per test file.
          testTimeout: 20_000,
        },
      },
      {
        // Anything that needs a GPU context, real layout or real pointer input.
        extends: true,
        test: {
          name: 'browser',
          include: ['src/**/*.browser.test.{ts,tsx}', 'test/**/*.browser.test.{ts,tsx}'],
          setupFiles: ['./test/setup.ts'],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
