import { FolderCog, Users } from '@lucide/solid';
import { NavLink } from '@solid-slopkit/ui';

export default function Nested() {
  return (
    <nav aria-label="Example" style={{ width: '260px' }}>
      <NavLink label="Team" leftSection={<Users />} defaultOpened>
        <NavLink href="#members" label="Members" active />
        <NavLink href="#roles" label="Roles" />
      </NavLink>
      <NavLink label="Projects" leftSection={<FolderCog />}>
        <NavLink href="#active" label="Active" />
        <NavLink label="Archived">
          <NavLink href="#2025" label="2025" />
          <NavLink href="#2024" label="2024" />
        </NavLink>
      </NavLink>
    </nav>
  );
}
