import { createSignal, For } from 'solid-js';
import { Gauge, Inbox, Settings } from '@lucide/solid';
import { Badge, NavLink } from '@solid-slopkit/ui';

const links = [
  { href: '#dashboard', label: 'Dashboard', icon: Gauge },
  { href: '#inbox', label: 'Inbox', icon: Inbox, description: 'Messages from your team', count: 3 },
  { href: '#settings', label: 'Settings', icon: Settings },
];

export default function Basic() {
  const [current, setCurrent] = createSignal('#dashboard');

  return (
    <nav aria-label="Example" style={{ width: '260px' }}>
      <For each={links}>
        {(link) => (
          <NavLink
            href={link.href}
            label={link.label}
            description={link.description}
            leftSection={<link.icon />}
            rightSection={link.count ? <Badge size="sm">{link.count}</Badge> : undefined}
            active={current() === link.href}
            onClick={(event: MouseEvent) => {
              event.preventDefault();
              setCurrent(link.href);
            }}
          />
        )}
      </For>
      <NavLink href="#billing" label="Billing" disabled />
    </nav>
  );
}
