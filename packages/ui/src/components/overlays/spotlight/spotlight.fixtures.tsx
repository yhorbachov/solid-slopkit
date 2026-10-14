import { Spotlight } from '.';
import { Kbd } from '../../typography/kbd';

const actions = [
  {
    id: 'home',
    label: 'Home',
    description: 'Go to the home page',
    group: 'Pages',
    keywords: ['start'],
    rightSection: () => <Kbd>↵</Kbd>,
  },
  { id: 'save', label: 'Save', group: 'Commands', disabled: true },
];
export const closed = () => (
  <div>
    <p>Page</p>
    <Spotlight opened={false} onClose={() => {}} actions={actions} />
  </div>
);
export const open = () => <Spotlight opened onClose={() => {}} actions={actions} title="Commands" />;
export const empty = () => (
  <Spotlight opened onClose={() => {}} actions={actions} defaultQuery="missing" withCloseButton={false} />
);
