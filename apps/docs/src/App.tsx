import { Title } from '@solidjs/meta';
import { Loading } from 'solid-js';
import { paths, Router } from './router';
import '@slopkit/ui/styles/slopkit.css';
import '@slopkit/ui/styles/default-theme.css';

import './App.css';

export default function App() {
  return (
    <Router>
      {(props) => (
        <>
          <Title>Solid App</Title>
          <nav>
            <a href={paths()}>Home</a>
            <a href={paths.users()}>Users</a>
          </nav>
          <Loading fallback={<main>Loading…</main>}>{props.children}</Loading>
        </>
      )}
    </Router>
  );
}
