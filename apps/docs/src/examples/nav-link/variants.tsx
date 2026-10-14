import { Group, NavLink, Stack } from '@solid-slopkit/ui';

export default function Variants() {
  return (
    <Group align="start">
      <Stack gap={0} style={{ width: '220px' }}>
        <NavLink href="#soft" label="Soft, primary" active />
        <NavLink href="#soft-success" label="Soft, success" color="success" active />
      </Stack>
      <Stack gap={0} style={{ width: '220px' }}>
        <NavLink href="#solid" label="Solid, primary" variant="solid" active />
        <NavLink href="#solid-error" label="Solid, error" variant="solid" color="error" active />
      </Stack>
    </Group>
  );
}
