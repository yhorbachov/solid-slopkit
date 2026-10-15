import { createSignal, For } from 'solid-js';
import { Folder, House, Inbox } from '@lucide/solid';
import {
  AppShell,
  Group,
  SegmentedControl,
  Stack,
  Text,
  type AppShellSidebarCollapsible,
  type AppShellSidebarPosition,
  type AppShellSidebarVariant,
} from '@solid-slopkit/ui';

const pages = [
  { label: 'Home', icon: House },
  { label: 'Inbox', icon: Inbox },
  { label: 'Projects', icon: Folder },
];

export default function Variants() {
  const [variant, setVariant] = createSignal<AppShellSidebarVariant>('floating');
  const [collapsible, setCollapsible] = createSignal<AppShellSidebarCollapsible>('offcanvas');
  const [position, setPosition] = createSignal<AppShellSidebarPosition>('left');

  return (
    <Stack style={{ width: '100%' }}>
      <Group>
        <SegmentedControl
          aria-label="Variant"
          data={['sidebar', 'floating', 'inset']}
          value={variant()}
          onChange={(value) => setVariant(value as AppShellSidebarVariant)}
        />
        <SegmentedControl
          aria-label="Collapsible"
          data={['offcanvas', 'icon', 'none']}
          value={collapsible()}
          onChange={(value) => setCollapsible(value as AppShellSidebarCollapsible)}
        />
        <SegmentedControl
          aria-label="Position"
          data={['left', 'right']}
          value={position()}
          onChange={(value) => setPosition(value as AppShellSidebarPosition)}
        />
      </Group>
      {/* Only one shell on a page should answer the shortcut. */}
      <AppShell class="docs-app-shell" shortcut={null}>
        <AppShell.Sidebar variant={variant()} collapsible={collapsible()} position={position()}>
          <AppShell.SidebarHeader>
            <Text weight="semibold" truncate>
              Acme Inc.
            </Text>
          </AppShell.SidebarHeader>
          <AppShell.SidebarContent>
            <AppShell.Group label="Platform">
              <AppShell.Menu>
                <For each={pages}>
                  {(page, index) => (
                    <AppShell.MenuItem>
                      <AppShell.MenuButton icon={<page.icon />} tooltip={page.label} active={index() === 0}>
                        {page.label}
                      </AppShell.MenuButton>
                    </AppShell.MenuItem>
                  )}
                </For>
              </AppShell.Menu>
            </AppShell.Group>
          </AppShell.SidebarContent>
          <AppShell.Rail />
        </AppShell.Sidebar>
        <AppShell.Main as="div">
          <header class="docs-app-shell-header">
            <AppShell.Trigger />
            <Text weight="medium">
              {variant()}, {collapsible()}
            </Text>
          </header>
        </AppShell.Main>
      </AppShell>
    </Stack>
  );
}
