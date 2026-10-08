import { For } from 'solid-js';
import { nav } from '../nav';

// Plain anchors: the router marks the current one with aria-current="page".
export function Sidebar() {
  return (
    <nav id="docs-sidebar" class="docs-sidebar" aria-label="Documentation">
      <For each={nav}>
        {(section) => (
          <section class="docs-nav-section">
            <h2 class="docs-nav-title">{section.title}</h2>
            <ul>
              <For each={section.items}>
                {(item) => (
                  <li>
                    <a href={item.href}>{item.title}</a>
                  </li>
                )}
              </For>
            </ul>
          </section>
        )}
      </For>
    </nav>
  );
}
