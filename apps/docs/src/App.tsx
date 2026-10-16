import { Loading, Show, type ParentProps } from 'solid-js';
import { useLocation } from '@solidjs/router';
import { Modals, Notifications, SlopkitUi } from '@solid-slopkit/ui';
import { Router } from './router';
import { Shell } from './layout/Shell';
import '@solid-slopkit/ui/styles/slopkit.css';
import '@solid-slopkit/ui/styles/default-theme.css';
import './themes.css';

import './App.css';

// The theme builder fills the window with its own frame; every other page sits in the docs shell.
function Frame(props: ParentProps) {
  const location = useLocation();
  return (
    <Show when={location.pathname !== '/create'} fallback={props.children}>
      <Shell>{props.children}</Shell>
    </Show>
  );
}

export default function App() {
  return (
    <SlopkitUi>
      <Router>
        {(props) => (
          <Frame>
            <Loading fallback={<p class="docs-loading">Loading…</p>}>{props.children}</Loading>
          </Frame>
        )}
      </Router>
      <Notifications />
      <Modals />
    </SlopkitUi>
  );
}
