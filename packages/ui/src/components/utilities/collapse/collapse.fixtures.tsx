// SSR scenarios for collapse.test.tsx.
import { Collapse } from '.';

export const collapses = () => (
  <div>
    <Collapse expanded id="open" class="mine" duration={300} timingFunction="linear">
      <p>Expanded</p>
    </Collapse>
    <Collapse expanded={false} animateOpacity={false} style={{ color: 'red' }}>
      <p>Collapsed</p>
    </Collapse>
  </div>
);
