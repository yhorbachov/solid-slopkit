import { createSignal, type Accessor } from 'solid-js';
import { createFacadeRegistry, warn } from './facade';

export interface UseSpotlight {
  /** Whether the spotlight is open. */
  opened: Accessor<boolean>;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export interface SpotlightStore extends UseSpotlight {
  /** Called by a `<Spotlight>` while it's mounted. Returns the function that unregisters it. */
  attachHost: () => () => void;
}

/**
 * Whether the spotlight of one provider tree is open. Like the modals, it's written from event handlers and has no
 * owner. A `<Spotlight>` shows it; without one, opening does nothing but warn.
 */
export function createSpotlightStore(): SpotlightStore {
  const [opened, setOpened] = createSignal(false, { name: 'spotlight.opened' });
  // A plain copy of the signal's value: a signal written outside a flush still reads its old value.
  let isOpened = false;
  let hosts = 0;

  const set = (next: boolean) => {
    if (next && hosts === 0) {
      warn('the spotlight was opened, but no <Spotlight> is mounted to show it.');
      return;
    }
    if (next === isOpened) return;
    isOpened = next;
    setOpened(next);
  };

  return {
    opened,
    open: () => set(true),
    close: () => set(false),
    toggle: () => set(!isOpened),
    attachHost() {
      if (++hosts > 1) warn('more than one <Spotlight> is mounted under one <SlopkitUi>; they open together.');
      return () => {
        hosts--;
      };
    },
  };
}

const registry = createFacadeRegistry<SpotlightStore>('spotlight');

/** Makes a root provider's store the one the `spotlight` facade reaches, while the provider is mounted. */
export const registerSpotlightStore = registry.register;

/**
 * Opens and closes the spotlight from anywhere, through the most recently mounted `<SlopkitUi>`. Inside components,
 * prefer `useSpotlight()`, which reaches the provider the component is in. On the server it does nothing.
 */
export const spotlight = {
  open: (): void => registry.target('open')?.open(),
  close: (): void => registry.target('close')?.close(),
  toggle: (): void => registry.target('toggle')?.toggle(),
};
