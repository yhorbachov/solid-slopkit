# Card

Content grouped on a surface, built from fixed parts: `Card.Header`, `Card.Image`, `Card.Body` and `Card.Footer`.

```tsx
import { Card } from '@solid-slopkit/ui';
```

## Usage

```tsx
<Card>
  <Card.Image src="/norway.jpg" alt="A fjord at dawn" />
  <Card.Header>
    <Title order={3} size="h5">
      Norway
    </Title>
    <Badge>New</Badge>
  </Card.Header>
  <Card.Body>
    <Text size="sm" dimmed>
      Fjords, mountains and the midnight sun.
    </Text>
  </Card.Body>
  <Card.Footer>
    <Button variant="ghost">Details</Button>
    <Button color="primary">Book</Button>
  </Card.Footer>
</Card>
```

- **Parts:** each one is optional and renders its own element.
  - `Card.Header`: a row; a title at the start and anything after it at the end.
  - `Card.Image`: a full-bleed `img`, flush with the card's edges and clipped to its corners. It takes the `img` attributes, and `alt` is required (`alt=""` for a decorative image). It's cropped to fit (`object-fit: cover`); set its height with `style` or a selector.
  - `Card.Body`: the padded main content. A body right after a header shares the header's padding instead of doubling it.
  - `Card.Footer`: a row of actions aligned to the end, below a divider.
- **Variant:** `outline` (a bordered base-100 surface, the default), `soft` (base-200, no border) or `elevated` (base-100 with a shadow).
- **Padding:** each part is padded by 1.25rem (5 spacing units). Change it with a selector on the parts.
- **Orientation:** `horizontal` puts the image in a column on the start side (two fifths of the width) and stacks the header, body and footer beside it. The other parts set the card's height and the image fills it. Use one of each part in a horizontal card. For a layout that changes per breakpoint, switch `orientation` from your own state.
- **Element:** the root is a `div`. Pass `role="article"` with an `aria-label`, or put a heading in the header, when the card stands for a piece of content.
- Card doesn't take style props. Space cards with a Stack, Group or SimpleGrid.

## Props

### Card

Other props are passed to the `div`.

| Prop          | Type                                | Default      | Description                                    |
| ------------- | ----------------------------------- | ------------ | ---------------------------------------------- |
| `variant`     | `'outline' \| 'soft' \| 'elevated'` | `'outline'`  | Surface style.                                 |
| `orientation` | `'vertical' \| 'horizontal'`        | `'vertical'` | `horizontal` puts the image on the start side. |

### Parts

`Card.Header`, `Card.Body` and `Card.Footer` take the attributes of a `div`; `Card.Image` takes those of an `img`, with `alt` required. They are also exported as `CardHeader`, `CardImage`, `CardBody` and `CardFooter`.

## Styling

Write plain CSS against these selectors. Component rules live in `@layer slopkit.components`, so unlayered CSS wins.

- Root class: `.slp-card`, with `data-variant` and `data-orientation`.
- Each part is a component with its own root class: `.slp-card-header`, `.slp-card-image`, `.slp-card-body`, `.slp-card-footer`.
- Examples: `.slp-card-image { aspect-ratio: 16 / 9 }`, or `.slp-card[data-orientation='horizontal'] { grid-template-columns: 8rem 1fr }` for a narrower side image.
