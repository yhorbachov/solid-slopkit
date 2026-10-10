import { AspectRatio, SimpleGrid } from '@slopkit/ui';

export default function Image() {
  return (
    <SimpleGrid cols={3} spacing={2} style={{ width: '100%' }}>
      {[
        { ratio: 1, label: '1' },
        { ratio: 16 / 9, label: '16 / 9' },
        { ratio: 3 / 4, label: '3 / 4' },
      ].map(({ ratio, label }) => (
        <figure style={{ margin: 0 }}>
          <AspectRatio ratio={ratio}>
            <img src="/example-landscape.svg" alt="Mountains at sunset" />
          </AspectRatio>
          <figcaption>ratio={`{${label}}`}</figcaption>
        </figure>
      ))}
    </SimpleGrid>
  );
}
