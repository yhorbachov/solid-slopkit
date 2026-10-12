import { omit } from 'solid-js';
import { type JSX } from '@solidjs/web';
import style from './card.module.css';
import { mergeDefaultProps } from '../../../utils';
import { joinClass } from '../../../style-props';

export type CardVariant = 'outline' | 'soft' | 'elevated';
export type CardOrientation = 'vertical' | 'horizontal';

export interface CardOwnProps {
  /** `outline` (bordered, the default), `soft` (a quieter surface, no border) or `elevated` (a shadow). */
  variant?: CardVariant;
  /** `horizontal` puts Card.Image on the start side and stacks the other parts beside it. Defaults to `vertical`. */
  orientation?: CardOrientation;
}

export type CardProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, keyof CardOwnProps> & CardOwnProps;
export type CardPartProps = JSX.HTMLAttributes<HTMLDivElement>;
export type CardImageProps = JSX.ImgHTMLAttributes<HTMLImageElement>;

/** The top part, for a title: a row that puts anything after the title at the end. */
export function CardHeader(props: CardPartProps) {
  const others = omit(props, 'class');
  return <div class={joinClass(['slp-card-header', style.header], props.class)} {...others} />;
}

/** The padded main content. */
export function CardBody(props: CardPartProps) {
  const others = omit(props, 'class');
  return <div class={joinClass(['slp-card-body', style.body], props.class)} {...others} />;
}

/** The bottom part: a row of actions aligned to the end, below a divider. */
export function CardFooter(props: CardPartProps) {
  const others = omit(props, 'class');
  return <div class={joinClass(['slp-card-footer', style.footer], props.class)} {...others} />;
}

/** A full-bleed image, flush with the card's edges and cropped to fit. Takes the `img` attributes; `alt` is required. */
export function CardImage(props: CardImageProps & { alt: string }) {
  const others = omit(props, 'class');
  return <img class={joinClass(['slp-card-image', style.image], props.class)} {...others} />;
}

/** A card: content grouped on a surface, built from Card.Header, Card.Image, Card.Body and Card.Footer. */
export function Card(props: CardProps) {
  const mergedProps = mergeDefaultProps({ variant: 'outline', orientation: 'vertical' } as const, props);
  const others = omit(mergedProps, 'class', 'variant', 'orientation');

  return (
    <div
      data-variant={mergedProps.variant}
      data-orientation={mergedProps.orientation}
      class={joinClass(['slp-card', style.card], mergedProps.class)}
      {...others}
    />
  );
}

Card.Header = CardHeader;
Card.Image = CardImage;
Card.Body = CardBody;
Card.Footer = CardFooter;
