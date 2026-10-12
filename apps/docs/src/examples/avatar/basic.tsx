import { Avatar } from '@solid-slopkit/ui';

export default function Basic() {
  return (
    <>
      <Avatar src="/example-landscape.svg" name="Sunset Hills" />
      <Avatar name="Grace Hopper" color="primary" />
      <Avatar src="/missing-photo.jpg" name="Ada Lovelace" color="secondary" />
      <Avatar />
    </>
  );
}
