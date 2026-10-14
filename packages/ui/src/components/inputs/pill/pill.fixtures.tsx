// SSR scenarios for pill.test.tsx.
import { Pill } from '.';

export const pills = () => (
  <div>
    <Pill class="mine">Plain</Pill>
    <Pill size="lg" withRemoveButton removeLabel="Delete">
      Removable
    </Pill>
    <Pill.Group size="sm" disabled>
      <Pill withRemoveButton>In a group</Pill>
      <Pill>Another</Pill>
    </Pill.Group>
  </div>
);
