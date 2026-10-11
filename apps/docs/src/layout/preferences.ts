// The docs' own color scheme and theme preferences, until useColorScheme() lands (M0.12).

export const THEMES = ['default', 'orange', 'green'] as const;
export type DocsTheme = (typeof THEMES)[number];

// Themes that support only one color scheme, and so pin it.
export const PINNED_SCHEME: Partial<Record<DocsTheme, 'light' | 'dark'>> = { green: 'light' };

const SCHEME_KEY = 'slp-docs-color-scheme';
const THEME_KEY = 'slp-docs-theme';

// Runs in <head> before first paint, so saved choices never flash the defaults.
export const preferencesScript = `try{var d=document.documentElement.dataset,s=localStorage.getItem('${SCHEME_KEY}'),t=localStorage.getItem('${THEME_KEY}');if(s==='light'||s==='dark')d.slpColorScheme=s;if(${JSON.stringify(THEMES.slice(1))}.indexOf(t)>=0)d.slpTheme=t}catch(e){}`;

function save(key: string, value: string | undefined) {
  try {
    if (value === undefined) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Storage blocked: the choice still applies to this page.
  }
}

export function readTheme(): DocsTheme {
  const theme = document.documentElement.dataset.slpTheme;
  return (THEMES as readonly string[]).includes(theme ?? '') ? (theme as DocsTheme) : 'default';
}

export function applyTheme(theme: DocsTheme) {
  const value = theme === 'default' ? undefined : theme;
  if (value) document.documentElement.dataset.slpTheme = value;
  else delete document.documentElement.dataset.slpTheme;
  save(THEME_KEY, value);
}

export function toggleColorScheme() {
  const root = document.documentElement;
  const current = root.dataset.slpColorScheme ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const next = current === 'dark' ? 'light' : 'dark';
  root.dataset.slpColorScheme = next;
  save(SCHEME_KEY, next);
}
