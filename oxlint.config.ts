import { defineConfig } from 'oxlint';
import solidV2 from 'eslint-plugin-solid/configs/v2';

export default defineConfig({
  jsPlugins: ['eslint-plugin-solid'],
  ignorePatterns: ['**/*.gen.*', 'dist'],
  settings: solidV2.settings,
  rules: solidV2.rules,
  overrides: [
    {
      // Forms tests read signals and store values outside tracked scopes on purpose, to assert on them.
      files: ['packages/forms/src/**/*.test.{ts,tsx}'],
      rules: { 'solid/reactivity': 'off' },
    },
  ],
});
