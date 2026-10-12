// SSR scenarios for input-wrapper.test.tsx.
import { InputWrapper } from '.';
import { Input } from '../input';

export const wrappers = () => (
  <div>
    <InputWrapper label="Email" description="We never share it." error="Enter a valid email." required class="mine">
      <Input type="email" />
    </InputWrapper>
    <InputWrapper label="Nickname" withAsterisk size="xl" id="nick">
      <Input />
    </InputWrapper>
    <InputWrapper label="Plan" labelElement="div" error>
      <div role="radiogroup" aria-labelledby="plan-label" />
    </InputWrapper>
    {/* No label, description or error: only the field. */}
    <InputWrapper>
      <Input aria-label="Bare" />
    </InputWrapper>
  </div>
);
