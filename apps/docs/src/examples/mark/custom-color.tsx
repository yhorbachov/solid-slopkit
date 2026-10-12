import { Mark, Text } from '@solid-slopkit/ui';

export default function CustomColor() {
  return (
    <Text>
      A one-off color goes through the <Mark style={{ '--slp-mark-color': '#e64980' }}>custom property</Mark>.
    </Text>
  );
}
