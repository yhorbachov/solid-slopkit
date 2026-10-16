import { defineConfig } from 'vitest/config';
import solid from '@solidjs/vite-plugin';

// The package ships uncompiled Solid source (see `build:source`); this config only serves the tests.
export default defineConfig({
  plugins: [solid({ ssr: true })],
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          include: ['src/**/*.test.{ts,tsx}', 'test/**/*.test.ts'],
          setupFiles: ['./test/setup.ts'],
        },
      },
    ],
  },
});
