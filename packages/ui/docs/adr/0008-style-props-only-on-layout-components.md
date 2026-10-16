# Style props only on layout components

Style props (`m*`, `p*`, `w`, `h`, `mi*`/`ma*`, `display`, and each layout component's own props like `gap` or `cols`) are only accepted by layout components: Box, Flex, Stack, Group, SimpleGrid, Grid, Container, Center, AspectRatio and Space. They are resolved at runtime into hashed classes registered with `<SlopkitUi>`. Every other component, such as `Button`, `TextInput` or `Select`, takes `class`/`style` like a plain element and is positioned by a layout component around it.

Readers may expect `<Button mt={4}>` to work. It doesn't, on purpose. Leaf components are rendered many times per page and have been tuned down to a plain element with string classes. Splitting style props and resolving classes on each of them would add per-instance cost, for a convenience that `Stack`/`Group` gaps already cover.

## Consequences

- Only layout components use the runtime style engine.
- If leaf components later need some spacing, the escape hatch is to add margin and width props only. That change would be additive. Going the other way, from every component to layout only, would be breaking.
