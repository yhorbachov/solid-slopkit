import { List } from '@solid-slopkit/ui';

export default function Basic() {
  return (
    <List spacing="xs">
      <List.Item>Install the package from the release tarball</List.Item>
      <List.Item>Import the stylesheet and a theme</List.Item>
      <List.Item>Wrap the app in the provider</List.Item>
    </List>
  );
}
