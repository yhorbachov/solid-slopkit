import type { HighlighterCore } from 'shiki/core';

export type CodeLang = 'tsx' | 'css' | 'bash';

let highlighter: Promise<HighlighterCore> | undefined;

// Shiki is loaded on first use and only with the languages the docs need, using the
// JavaScript regex engine so no WASM is shipped.
function getHighlighter() {
  highlighter ??= Promise.all([import('shiki/core'), import('shiki/engine/javascript')]).then(
    ([{ createHighlighterCore }, { createJavaScriptRegexEngine }]) =>
      createHighlighterCore({
        themes: [import('shiki/themes/github-light.mjs')],
        langs: [import('shiki/langs/tsx.mjs'), import('shiki/langs/css.mjs'), import('shiki/langs/bash.mjs')],
        engine: createJavaScriptRegexEngine(),
      }),
  );
  return highlighter;
}

export async function highlight(code: string, lang: CodeLang): Promise<string> {
  return (await getHighlighter()).codeToHtml(code, { lang, theme: 'github-light' });
}
