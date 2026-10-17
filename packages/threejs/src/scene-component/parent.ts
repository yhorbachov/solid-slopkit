import { createContext } from 'solid-js';

/** The Instance that the Scene components inside it attach to. A Canvas provides its scene. Internal. */
export const ParentContext = createContext<object>();
