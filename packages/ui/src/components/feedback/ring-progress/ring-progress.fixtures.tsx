// SSR scenarios for ring-progress.test.tsx.
import { RingProgress } from '.';

export const rings = () => (
  <div>
    <RingProgress class="mine" value={40}>
      40%
    </RingProgress>
    <RingProgress value={3} max={5} color="success" size="lg" label="Steps done" />
    <RingProgress value={0} size="sm" />
    <RingProgress label="Syncing" />
  </div>
);
