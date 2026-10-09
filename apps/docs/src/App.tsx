import { Loading } from 'solid-js';
import { SlopkitUi } from '@slopkit/ui';
import { Router } from './router';
import { Shell } from './layout/Shell';
import '@slopkit/ui/styles/slopkit.css';
import '@slopkit/ui/styles/default-theme.css';

import './App.css';

export default function App() {
  return (
    <SlopkitUi>
      <Router>
        {(props) => (
          <Shell>
            <Loading fallback={<p class="docs-loading">Loading…</p>}>{props.children}</Loading>
          </Shell>
        )}
      </Router>
    </SlopkitUi>
  );
}
