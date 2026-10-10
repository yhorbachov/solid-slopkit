import { createContext, createSignal, useContext } from 'solid-js';
import { isServer, useHead, type HeadTag, type JSX } from '@solidjs/web';

interface SlopkitUiContextValue {
  /** Adds a class's CSS to the provider's stylesheet. Registering a class that is already there is a no-op. */
  registerStyle(className: string, css: string): void;
}

const SlopkitUiContext = createContext<SlopkitUiContextValue | null>(null);

/**
 * Root of a slopkit UI tree. Components that generate CSS at runtime, such as Box, register it here, and the
 * provider renders all of it in one <style>. Registered CSS stays for the provider's lifetime, so a class
 * whose last component unmounts keeps its rule. On the server, each request renders its own provider, so
 * styles never leak between requests.
 */
export function SlopkitUi(props: { children?: JSX.Element }) {
  const styles = new Map<string, string>();
  // Client only: tells the head registry's effect that a class was added, so it re-reads the CSS. Components
  // register while rendering, which is an intentional write in an owned scope. Never written on the server,
  // where nothing re-renders and the head reads the CSS when it flushes.
  const [stylesAdded, notifyStylesAdded] = createSignal(undefined, {
    equals: false,
    ownedWrite: true,
    name: 'SlopkitUi.stylesAdded',
  });

  // Joined once per change rather than per registration. The map only grows, so its size is the cache key.
  let joined = { size: -1, css: '' };
  const css = () => {
    stylesAdded();
    if (joined.size !== styles.size) joined = { size: styles.size, css: [...styles.values()].join('') };
    return joined.css;
  };

  // `useHead` with a getter rather than <Style>: <Style> computes its body when it renders, which on the
  // server is before the components below have registered anything. The getter is read when the head
  // flushes (and tracked on the client).
  // Nothing until a component registers CSS, so apps without generated styles get no empty <style>.
  const tag = (): HeadTag[] => {
    const value = css();
    return value ? [{ tag: 'style', key: 'slopkit-ui', props: { children: value } }] : [];
  };
  useHead(tag);

  const context: SlopkitUiContextValue = {
    registerStyle(className, value) {
      if (styles.has(className)) return;
      styles.set(className, value);
      // The server flushes head tags per streamed boundary. Registering the same key again from the boundary
      // that added the class makes its flush replace the <style> with the full CSS.
      if (isServer) useHead(tag);
      else notifyStylesAdded();
    },
  };

  return <SlopkitUiContext value={context}>{props.children}</SlopkitUiContext>;
}

export function useSlopkitUi(component: string): SlopkitUiContextValue {
  const context = useContext(SlopkitUiContext);
  if (!context) throw new Error(`<${component}> must be rendered inside <SlopkitUi>.`);
  return context;
}
