import { createEffect, createSignal, type ParentProps } from 'solid-js';
import { useLocation } from '@solidjs/router';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function Shell(props: ParentProps) {
  const [navOpen, setNavOpen] = createSignal(false, { name: 'navOpen' });
  const location = useLocation();

  // Close the mobile drawer after navigating.
  createEffect(
    () => location.pathname,
    () => {
      setNavOpen(false);
    },
  );

  return (
    <div class="docs-shell" data-nav-open={navOpen() ? '' : undefined}>
      <Header navOpen={navOpen()} onToggleNav={() => setNavOpen((open) => !open)} />
      <div class="docs-backdrop" onClick={() => setNavOpen(false)} />
      <Sidebar />
      <main class="docs-main">{props.children}</main>
    </div>
  );
}
