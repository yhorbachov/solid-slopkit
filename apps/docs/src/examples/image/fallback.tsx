import { Image } from '@solid-slopkit/ui';

export default function Fallback() {
  return (
    <Image
      src="/missing-photo.jpg"
      fallbackSrc="/example-placeholder.svg"
      alt="Product photo"
      width={240}
      height={160}
      style={{ 'border-radius': '8px' }}
    />
  );
}
