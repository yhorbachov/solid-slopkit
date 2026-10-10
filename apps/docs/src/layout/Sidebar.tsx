import { For } from 'solid-js';
import { nav, type NavItem } from '../nav';

function NavList(props: { items: NavItem[] }) {
  return (
    <ul>
      <For each={props.items}>
        {(item) => (
          <li>
            <a href={item.href}>{item.title}</a>
          </li>
        )}
      </For>
    </ul>
  );
}

// Plain anchors: the router marks the current one with aria-current="page".
export function Sidebar() {
  return (
    <nav id="docs-sidebar" class="docs-sidebar" aria-label="Documentation">
      <For each={nav}>
        {(section) => (
          <section class="docs-nav-section">
            <h2 class="docs-nav-title">{section.title}</h2>
            <NavList items={section.items} />
            <For each={section.groups ?? []}>
              {(group) => (
                <div class="docs-nav-group">
                  <h3 class="docs-nav-group-title">{group.title}</h3>
                  <NavList items={group.items} />
                </div>
              )}
            </For>
          </section>
        )}
      </For>
    </nav>
  );
}
