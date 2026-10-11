import { Button } from '@solid-slopkit/ui';
import { Menu, X } from '@lucide/solid';

export function Header(props: { navOpen: boolean; onToggleNav: () => void }) {
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
    </header>
  );
}
