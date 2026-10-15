import { createSignal, For, Show } from 'solid-js';
import {
  Calendar,
  ChartPie,
  ChevronRight,
  ChevronsUpDown,
  Ellipsis,
  Folder,
  GalleryVerticalEnd,
  House,
  Inbox,
  Plus,
  Settings,
} from '@lucide/solid';
import { AppShell, Avatar, Text } from '@solid-slopkit/ui';

const pages = [
  { href: '#home', label: 'Home', icon: House },
  { href: '#inbox', label: 'Inbox', icon: Inbox, count: 12 },
  { href: '#calendar', label: 'Calendar', icon: Calendar },
  { href: '#reports', label: 'Reports', icon: ChartPie },
];

const projects = ['Design system', 'Marketing site', 'Mobile app'];

export default function Basic() {
  const [current, setCurrent] = createSignal('#home');
  const [settingsOpened, setSettingsOpened] = createSignal(true);
  // A link in the example only marks itself current, instead of leaving the page.
  const go = (href: string) => (event: MouseEvent) => {
    event.preventDefault();
    setCurrent(href);
  };

  // The docs' own shell answers ⌘B / Ctrl+B.
  return (
    <AppShell class="docs-app-shell" shortcut={null}>
      <AppShell.Sidebar collapsible="icon" label="Navigation">
        <AppShell.SidebarHeader>
          <AppShell.Menu>
            <AppShell.MenuItem>
              <AppShell.MenuButton size="lg" icon={<GalleryVerticalEnd />} tooltip="Acme Inc.">
                <span style={{ display: 'flex', 'flex-direction': 'column', flex: 1, 'min-width': 0 }}>
                  <strong>Acme Inc.</strong>
                  <span style={{ 'font-size': 'var(--slp-font-size-xs)' }}>Enterprise</span>
                </span>
                <ChevronsUpDown size={16} />
              </AppShell.MenuButton>
            </AppShell.MenuItem>
          </AppShell.Menu>
        </AppShell.SidebarHeader>

        <AppShell.SidebarContent>
          <nav aria-label="Main">
            <AppShell.Group label="Platform">
              <AppShell.Menu>
                <For each={pages}>
                  {(page) => (
                    <AppShell.MenuItem>
                      <AppShell.MenuButton
                        href={page.href}
                        icon={<page.icon />}
                        tooltip={page.label}
                        active={current() === page.href}
                        onClick={go(page.href)}
                      >
                        {page.label}
                      </AppShell.MenuButton>
                      <Show when={page.count}>{(count) => <AppShell.MenuBadge>{count()}</AppShell.MenuBadge>}</Show>
                    </AppShell.MenuItem>
                  )}
                </For>
                <AppShell.MenuItem>
                  <AppShell.MenuButton
                    icon={<Settings />}
                    tooltip="Settings"
                    aria-expanded={settingsOpened() ? 'true' : 'false'}
                    onClick={() => setSettingsOpened(!settingsOpened())}
                  >
                    Settings
                    <ChevronRight
                      size={16}
                      style={{ transform: settingsOpened() ? 'rotate(90deg)' : undefined, transition: 'transform 200ms' }}
                    />
                  </AppShell.MenuButton>
                  <Show when={settingsOpened()}>
                    <AppShell.MenuSub>
                      <For each={['General', 'Team', 'Billing']}>
                        {(label) => {
                          const href = `#settings-${label.toLowerCase()}`;
                          return (
                            <AppShell.MenuSubItem>
                              <AppShell.MenuSubButton href={href} active={current() === href} onClick={go(href)}>
                                {label}
                              </AppShell.MenuSubButton>
                            </AppShell.MenuSubItem>
                          );
                        }}
                      </For>
                    </AppShell.MenuSub>
                  </Show>
                </AppShell.MenuItem>
              </AppShell.Menu>
            </AppShell.Group>

            <AppShell.Group label="Projects">
              <AppShell.GroupAction label="Add project">
                <Plus />
              </AppShell.GroupAction>
              <AppShell.Menu>
                <For each={projects}>
                  {(project) => {
                    const href = `#${project.toLowerCase().replaceAll(' ', '-')}`;
                    return (
                      <AppShell.MenuItem>
                        <AppShell.MenuButton
                          href={href}
                          icon={<Folder />}
                          tooltip={project}
                          active={current() === href}
                          onClick={go(href)}
                        >
                          {project}
                        </AppShell.MenuButton>
                        <AppShell.MenuAction label={`More for ${project}`} showOnHover>
                          <Ellipsis />
                        </AppShell.MenuAction>
                      </AppShell.MenuItem>
                    );
                  }}
                </For>
              </AppShell.Menu>
            </AppShell.Group>
          </nav>
        </AppShell.SidebarContent>

        <AppShell.SidebarFooter>
          <AppShell.Menu>
            <AppShell.MenuItem>
              <AppShell.MenuButton size="lg" icon={<Avatar size="sm" name="Ada Lovelace" />} tooltip="Ada Lovelace">
                <span style={{ display: 'flex', 'flex-direction': 'column', 'min-width': 0 }}>
                  <strong>Ada Lovelace</strong>
                  <span style={{ 'font-size': 'var(--slp-font-size-xs)' }}>ada@acme.dev</span>
                </span>
              </AppShell.MenuButton>
            </AppShell.MenuItem>
          </AppShell.Menu>
        </AppShell.SidebarFooter>
        <AppShell.Rail />
      </AppShell.Sidebar>

      <AppShell.Main as="div">
        <header class="docs-app-shell-header">
          <AppShell.Trigger />
          <Text weight="medium">{current()}</Text>
        </header>
        <div class="docs-app-shell-body">
          <Text>Press the button or the rail along the sidebar's edge to collapse it to its icons.</Text>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}
