import { createSignal, onSettled } from 'solid-js';
import { Button } from '@solid-slopkit/ui';
import { Menu, X } from '@lucide/solid';
import { ColorSchemeToggle } from './ColorSchemeToggle';
import { ThemeSwitcher } from './ThemeSwitcher';
import { applyTheme, PINNED_SCHEME, readTheme, type DocsTheme } from './preferences';

export function Header(props: { navOpen: boolean; onToggleNav: () => void }) {
  // The server can't know the saved theme, so both sides render the default and the client catches up with
  // what the head script applied once hydration settles.
  const [theme, setTheme] = createSignal<DocsTheme>('default', { name: 'theme' });
  onSettled(() => {
    setTheme(readTheme());
  });

  const changeTheme = (next: DocsTheme) => {
    applyTheme(next);
    setTheme(next);
  };

  return (
    <header class="docs-header">
      <Button
        class="docs-menu-button"
        variant="ghost"
        shape="square"
        size="sm"
        aria-label={props.navOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={props.navOpen ? 'true' : 'false'}
        aria-controls="docs-sidebar"
        onClick={() => props.onToggleNav()}
      >
        {props.navOpen ? <X /> : <Menu />}
      </Button>
      <a class="docs-wordmark" href="/">
        slopkit
      </a>
      <div class="docs-header-actions">
        <ThemeSwitcher theme={theme()} onChange={changeTheme} />
        <ColorSchemeToggle pinned={PINNED_SCHEME[theme()] !== undefined} />
      </div>
    </header>
  );
}
