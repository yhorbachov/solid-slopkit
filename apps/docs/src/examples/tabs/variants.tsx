import { For } from 'solid-js';
import { Stack, Tabs, type TabsVariant } from '@solid-slopkit/ui';

const variants: TabsVariant[] = ['underline', 'outline', 'pills'];

export default function Variants() {
  return (
    <Stack gap={6}>
      <For each={variants}>
        {(variant) => (
          <Tabs variant={variant} defaultValue="overview" color={variant === 'pills' ? 'secondary' : 'primary'}>
            <Tabs.List aria-label={`${variant} tabs`}>
              <Tabs.Tab value="overview">Overview</Tabs.Tab>
              <Tabs.Tab value="activity">Activity</Tabs.Tab>
              <Tabs.Tab value="members">Members</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        )}
      </For>
    </Stack>
  );
}
