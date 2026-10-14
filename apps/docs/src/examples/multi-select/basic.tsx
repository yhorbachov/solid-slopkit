import { MultiSelect } from '@solid-slopkit/ui';

export default function Basic() {
  return (
    <MultiSelect
      label="Languages"
      placeholder="Pick languages"
      data={['English', 'Deutsch', 'Français', 'Español', 'Italiano', 'Nederlands', 'Polski', 'Svenska']}
      defaultValue={['English', 'Deutsch']}
      style={{ width: '20rem' }}
    />
  );
}
