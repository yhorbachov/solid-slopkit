import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';

const librarySource = fileURLToPath(new URL('../../packages/ui/src/index.ts', import.meta.url));
const carouselSource = fileURLToPath(new URL('../../packages/ui/src/carousel/index.ts', import.meta.url));
const datesSource = fileURLToPath(new URL('../../packages/ui/src/dates/index.ts', import.meta.url));
const primitivesSource = fileURLToPath(new URL('../../packages/ui/src/primitives/index.ts', import.meta.url));
const formsSource = fileURLToPath(new URL('../../packages/forms/src/index.ts', import.meta.url));
const i18nSource = fileURLToPath(new URL('../../packages/i18n/src/runtime/index.ts', import.meta.url));
const slopkitStylesCss = fileURLToPath(new URL('../../packages/ui/src/styles/slopkit.css', import.meta.url));
const slopkitThemeCss = fileURLToPath(new URL('../../packages/ui/src/styles/default-theme.css', import.meta.url));

export function slopkitFromSource(): Plugin {
  return {
    name: 'slopkit-from-source',
    apply: 'serve',
    enforce: 'pre',
    resolveId(id) {
      if (id === '@solid-slopkit/ui') return librarySource;
      if (id === '@solid-slopkit/ui/carousel') return carouselSource;
      if (id === '@solid-slopkit/ui/dates') return datesSource;
      if (id === '@solid-slopkit/ui/primitives') return primitivesSource;
      if (id === '@solid-slopkit/forms') return formsSource;
      if (id === '@solid-slopkit/i18n') return i18nSource;
      if (id === '@solid-slopkit/ui/styles/slopkit.css') return slopkitStylesCss;
      if (id === '@solid-slopkit/ui/styles/default-theme.css') return slopkitThemeCss;
    },
  };
}
