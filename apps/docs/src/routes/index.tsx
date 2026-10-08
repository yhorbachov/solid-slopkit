import { Title } from '@solidjs/meta';
import { Button } from '@slopkit/ui';
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
      </div>

      <Button as="a" href="/ui" color="primary" rightSection={<ArrowRight />}>
        Get started
      </Button>
    </article>
  );
}
