// The LLM references are handwritten (ADR 0012). This keeps the index and the files in step: every link in
// src/llms.md resolves, and every component folder has its reference and is linked from the index.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

const src = join(dirname(fileURLToPath(import.meta.url)), '../src');
const index = readFileSync(join(src, 'llms.md'), 'utf8');
const links = [...index.matchAll(/\]\(([^)#]+\.md)\)/g)].map((match) => match[1]);

// Folders under a component group (layout, button, inputs, provider) that hold a component: they have an
// index.ts. The provider's reference is named after the component, not the folder.
const groups = ['layout', 'button', 'inputs'];
const componentDirs = groups.flatMap((group) =>
  readdirSync(join(src, 'components', group), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(src, 'components', group, entry.name, 'index.ts')))
    .map((entry) => join('components', group, entry.name)),
);

describe('LLM references', () => {
  test('every link in llms.md points at a file', () => {
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) expect(existsSync(join(src, link)), link).toBe(true);
  });

  test.each(componentDirs)('%s has a reference, linked from llms.md', (dir) => {
    const reference = join(dir, `${dir.split('/').at(-1)}.md`);
    expect(existsSync(join(src, reference)), reference).toBe(true);
    expect(links).toContain(relative(src, join(src, reference)));
  });

  test('the provider has a reference, linked from llms.md', () => {
    expect(links).toContain('components/provider/slopkit-ui.md');
  });
});
