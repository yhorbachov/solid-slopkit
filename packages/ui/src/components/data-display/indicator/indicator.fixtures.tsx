// SSR scenarios for indicator.test.tsx.
import { Indicator } from '.';

export const indicators = () => (
  <div>
    <Indicator class="mine">
      <button type="button">Inbox</button>
    </Indicator>
    <Indicator label="12" color="error" position="bottom-start" offset={4} size="lg">
      <span>Messages</span>
    </Indicator>
    <Indicator processing disabled>
      <span>Hidden mark</span>
    </Indicator>
  </div>
);
