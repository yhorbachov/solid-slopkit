import { Title } from '@solidjs/meta';
import { Button } from '@solid-slopkit/ui';
import { ArrowRight } from '@lucide/solid';

export default function Home() {
  return (
    <article class="docs-page">
      <Title>slopkit</Title>
      <h1>slopkit</h1>
      <p class="docs-lead">Packages for building SolidJS 2 apps.</p>

      <div class="docs-cards">
        <a class="docs-card" href="/ui">
          <h2>UI</h2>
          <p>Components styled with plain CSS and theme variables.</p>
        </a>
        <a class="docs-card" href="/forms">
          <h2>Forms</h2>
          <p>Schema-driven form state on Solid stores, with typed bindings for the inputs.</p>
        </a>
        <a class="docs-card" href="/i18n">
          <h2>i18n</h2>
          <p>Typed translation files that live next to each component.</p>
        </a>
        <a class="docs-card" href="/threejs">
          <h2>threejs</h2>
          <p>three.js scenes as components, updated through fine-grained reactivity.</p>
        </a>
      </div>

      <Button as="a" href="/ui" color="primary" rightSection={<ArrowRight />}>
        Get started
      </Button>
    </article>
  );
}
