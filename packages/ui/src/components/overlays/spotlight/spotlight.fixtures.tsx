// SSR scenarios for spotlight.test.tsx.
import { SlopkitUi } from '../../provider';
import { Spotlight } from '.';

const Icon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <circle cx="8" cy="8" r="6" />
  </svg>
);

// Closed on the server: its actions, and their JSX, aren't rendered until it opens.
export const host = () => (
  <SlopkitUi>
    <main>Page</main>
    <Spotlight
      actions={[
        { id: 'home', label: 'Home', leftSection: <Icon /> },
        { group: 'Settings', actions: [{ id: 'profile', label: 'Profile', rightSection: <Icon /> }] },
      ]}
    />
  </SlopkitUi>
);

// Actions made in a component's body, before it renders: their sections are functions.
export const actionsInBody = () => {
  const Page = () => {
    const actions = [{ id: 'home', label: 'Home', leftSection: () => <Icon />, rightSection: 'Go' }];
    return (
      <>
        <main>Page</main>
        <Spotlight actions={actions} />
      </>
    );
  };
  return (
    <SlopkitUi>
      <Page />
    </SlopkitUi>
  );
};
