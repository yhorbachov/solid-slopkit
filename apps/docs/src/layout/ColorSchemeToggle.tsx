import { Button } from '@solid-slopkit/ui';
import { Moon, Sun } from '@lucide/solid';
import { toggleColorScheme } from './preferences';

// With no saved choice the docs follow the OS. The icon is picked in CSS, so the server and the client render
// the same markup whatever the scheme.
export function ColorSchemeToggle(props: { pinned: boolean }) {
  return (
    <Button
      class="docs-scheme-toggle"
      variant="ghost"
      shape="square"
      size="sm"
      aria-label="Toggle color scheme"
      title={props.pinned ? 'This theme supports only one color scheme' : undefined}
      disabled={props.pinned}
      onClick={toggleColorScheme}
    >
      <Moon class="docs-scheme-icon-light" />
      <Sun class="docs-scheme-icon-dark" />
    </Button>
  );
}
