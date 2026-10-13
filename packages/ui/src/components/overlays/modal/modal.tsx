import { createUniqueId, omit, onSettled, Show, untrack } from 'solid-js';
import type { JSX } from '@solidjs/web';
import style from './modal.module.css';
import { createDismissal, createFocusScope, createPresence, getTabbables, type Presence } from '../../primitives';
import { transitionAttributes, type TransitionName } from '../../utilities/transition/transition-attributes';
import { CloseButton } from '../../button/close-button';
import { callHandler, mergeDefaultProps, type ElementProps } from '../../../utils';
import { joinClass } from '../../../style-props';
import type { SlopSize } from '../../../core';

export interface ModalOwnProps {
  /** Whether the modal is open. */
  opened: boolean;
  /** Called when it asks to close: the close button, Escape, or a press on the backdrop. Set `opened` to `false`. */
  onClose: () => void;
  /** The heading, which also names the dialog. Without one, name it with `aria-label`. */
  title?: JSX.Element;
  /** Shows a close button in the header. Defaults to `true`. */
  withCloseButton?: boolean;
  /** Accessible name of the close button. Defaults to `'Close'`. */
  closeButtonLabel?: string;
  /** Width: `xs` to `xl` (20 to 48rem). Defaults to `md` (28rem). It never grows past the viewport. */
  size?: SlopSize;
  /** Centers it vertically, rather than near the top. */
  centered?: boolean;
  /** Fills the viewport, without corners. */
  fullScreen?: boolean;
  /** Whether a press on the backdrop closes it. Defaults to `true`. */
  closeOnClickOutside?: boolean;
  /** Whether Escape closes it. Defaults to `true`. */
  closeOnEscape?: boolean;
  /** Moves focus back to where it was when it closes. Defaults to `true`. */
  returnFocus?: boolean;
  /** Stops the page from scrolling while it's open. Defaults to `true`. */
  lockScroll?: boolean;
  /** The content's enter and exit animation. Defaults to `pop`. The backdrop fades. */
  transition?: TransitionName;
  /** Duration of the animation, in milliseconds. Defaults to 200. */
  transitionDuration?: number;
}

export type ModalProps = ElementProps<JSX.DialogHtmlAttributes<HTMLDialogElement>, ModalOwnProps>;

/**
 * A dialog over the page: a modal `<dialog>` in the top layer, which makes the rest of the page inert and keeps focus
 * inside. Rendered while open. Opening focuses the element marked `data-autofocus`, else the first focusable one;
 * closing moves focus back. The close button, Escape and a press on the backdrop ask it to close through `onClose`.
 */
export function Modal(props: ModalProps) {
  let dialog: HTMLDialogElement | undefined;
  let content: HTMLDivElement | undefined;

  const presence = createPresence({ present: () => props.opened, element: () => dialog });
  createDismissal('Modal', {
    open: () => props.opened,
    elements: () => [content],
    onDismiss: () => props.onClose(),
    closeOnEscape: () => props.closeOnEscape ?? true,
    closeOnClickOutside: () => props.closeOnClickOutside ?? true,
  });
  // The dialog focuses its first element itself when it opens. Focus goes back once it has left: until then, the page
  // under it is inert and can't take focus.
  createFocusScope({
    open: presence.mounted,
    element: () => dialog,
    autoFocus: () => false,
    restoreFocus: () => props.returnFocus ?? true,
  });

  return (
    <Show when={presence.mounted()}>
      <ModalDialog
        {...props}
        presence={presence}
        setDialog={(element) => (dialog = element)}
        setContent={(element) => (content = element)}
      />
    </Show>
  );
}

interface ModalDialogProps extends ModalProps {
  presence: Presence;
  setDialog: (element: HTMLDialogElement) => void;
  setContent: (element: HTMLDivElement) => void;
}

function ModalDialog(props: ModalDialogProps) {
  const mergedProps = mergeDefaultProps(
    {
      withCloseButton: true,
      closeButtonLabel: 'Close',
      size: 'md',
      lockScroll: true,
      transition: 'pop',
      transitionDuration: 200,
    } as const,
    props,
  );
  const others = omit(
    mergedProps,
    'ref',
    'class',
    'style',
    'children',
    'opened',
    'onClose',
    'title',
    'withCloseButton',
    'closeButtonLabel',
    'size',
    'centered',
    'fullScreen',
    'closeOnClickOutside',
    'closeOnEscape',
    'returnFocus',
    'lockScroll',
    'transition',
    'transitionDuration',
    'presence',
    'setDialog',
    'setContent',
    'onCancel',
  );
  // The presence never changes: it's the parent's.
  const presence = untrack(() => props.presence);
  const animation = transitionAttributes(presence, {
    transition: () => mergedProps.transition,
    duration: () => mergedProps.transitionDuration,
    exitDuration: () => undefined,
    timingFunction: () => 'ease',
  });
  const titleId = `slp-modal-title-${createUniqueId()}`;
  // Whether there's a title, without reading it: a JSX prop is read only where it's rendered.
  const withTitle = untrack(() => 'title' in props);
  let dialog: HTMLDialogElement | undefined;

  // Modal once it's in the document, then focus on the element marked `data-autofocus`, else the first focusable one,
  // else the content.
  onSettled(() => {
    if (!dialog || dialog.open) return;
    dialog.showModal();
    const marked = dialog.querySelector<HTMLElement>('[data-autofocus]');
    const first = getTabbables(dialog)[0];
    const target = marked ?? first ?? dialog.querySelector<HTMLElement>('[data-slot="modal-content"]');
    target?.focus({ preventScroll: true });
  });

  return (
    <dialog
      ref={[
        (el: HTMLDialogElement) => {
          dialog = el;
          props.setDialog(el);
        },
        untrack(() => props.ref),
      ]}
      aria-labelledby={withTitle ? titleId : undefined}
      data-status={presence.status()}
      data-size={mergedProps.size}
      data-lock-scroll={mergedProps.lockScroll ? '' : undefined}
      data-centered={mergedProps.centered ? '' : undefined}
      data-full-screen={mergedProps.fullScreen ? '' : undefined}
      class={joinClass(['slp-modal', style.dialog], mergedProps.class)}
      style={{ '--_modal-duration': `${mergedProps.transitionDuration}ms`, ...props.style }}
      // Escape goes through the provider's order of overlays; the browser can still cancel without a key.
      onCancel={(event: Event) => {
        callHandler(props.onCancel, event);
        event.preventDefault();
        if (mergedProps.closeOnEscape ?? true) props.onClose();
      }}
      {...others}
    >
      <div
        ref={(el: HTMLDivElement) => props.setContent(el)}
        tabindex={-1}
        data-slot="modal-content"
        data-transition={animation['data-transition']}
        data-status={animation['data-status']}
        class={`${style.content} ${animation.class}`}
        style={animation.style}
      >
        <Show when={withTitle || mergedProps.withCloseButton}>
          <div data-slot="modal-header" class={style.header}>
            {withTitle && (
              <h2 id={titleId} data-slot="modal-title" class={style.title}>
                {props.title}
              </h2>
            )}
            <Show when={mergedProps.withCloseButton}>
              <CloseButton
                label={mergedProps.closeButtonLabel}
                data-slot="modal-close"
                class={style.close}
                onClick={() => props.onClose()}
              />
            </Show>
          </div>
        </Show>
        <div data-slot="modal-body" class={style.body}>
          {props.children}
        </div>
      </div>
    </dialog>
  );
}
