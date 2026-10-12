import { createSignal, omit, onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import style from './image.module.css';
import { callHandler, mergeDefaultProps, mergeRefs, type ElementProps, type Ref } from '../../../utils';
import { joinClass } from '../../../style-props';

export type ImageFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';

export interface ImageOwnProps {
  /** The image URL. */
  src?: string;
  /** Text alternative. Required; pass `alt=""` for a decorative image. */
  alt: string;
  /** How the image fills its box when the box has another aspect ratio (`object-fit`). Defaults to `cover`. */
  fit?: ImageFit;
  /** Shown instead of `src` when it fails to load. */
  fallbackSrc?: string;
  ref?: Ref<HTMLImageElement>;
}

export type ImageProps = ElementProps<JSX.ImgHTMLAttributes<HTMLImageElement>, ImageOwnProps>;

/** An image: an `img` that fills its box and can fall back to another source when it fails to load. */
export function Image(props: ImageProps) {
  let img: HTMLImageElement | undefined;
  const mergedProps = mergeDefaultProps({ fit: 'cover' as ImageFit }, props);
  const others = omit(mergedProps, 'ref', 'class', 'src', 'fit', 'fallbackSrc', 'onError');

  // The source that failed, so a new `src` gets its own try.
  const [failedSrc, setFailedSrc] = createSignal<string | undefined>(undefined, { name: 'Image.failedSrc' });
  const failed = () => props.src != null && failedSrc() === props.src;
  const src = () => (failed() && props.fallbackSrc ? props.fallbackSrc : props.src);

  const onError: JSX.EventHandler<HTMLImageElement, Event> = (event) => {
    if (!failed()) setFailedSrc(props.src);
    callHandler(props.onError, event);
  };

  // A server-rendered image can fail before hydration adds the error listener. A zero width alone isn't proof:
  // an SVG without a size has none either, so decode() decides.
  onSettled(() => {
    if (!img?.complete || img.naturalWidth > 0 || !img.getAttribute('src')) return;
    const failedAtMount = props.src;
    img.decode().catch(() => {
      if (props.src === failedAtMount) setFailedSrc(failedAtMount);
    });
  });

  return (
    <img
      ref={mergeRefs((el: HTMLImageElement) => (img = el), mergedProps.ref)}
      src={src()}
      data-fit={mergedProps.fit}
      data-fallback={failed() && props.fallbackSrc ? '' : undefined}
      class={joinClass(['slp-image', style.image], mergedProps.class)}
      onError={onError}
      {...others}
    />
  );
}
