import { Button } from '@solid-slopkit/ui';
import { Moon, Sun } from '@lucide/solid';

const STORAGE_KEY = 'slp-docs-color-scheme';

// Runs in <head> before first paint, so a saved choice never flashes the other scheme.
export const colorSchemeScript = `try{var s=localStorage.getItem('${STORAGE_KEY}');if(s==='light'||s==='dark')document.documentElement.dataset.slpColorScheme=s}catch(e){}`;

// Docs-only until useColorScheme() lands (M0.12). With no saved choice the docs follow the OS. The icon is
// picked in CSS, so the server and the client render the same markup whatever the scheme.
export function ColorSchemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const current = root.dataset.slpColorScheme ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    root.dataset.slpColorScheme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage blocked: the choice still applies to this page.
    }
  };

  return (
    <Button class="docs-scheme-toggle" variant="ghost" shape="square" size="sm" aria-label="Toggle color scheme" onClick={toggle}>
      <Moon class="docs-scheme-icon-light" />
      <Sun class="docs-scheme-icon-dark" />
    </Button>
  );
}
