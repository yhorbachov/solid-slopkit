# Dates on native Date and Intl, no date library

The date components (`@solid-slopkit/ui/dates`) work on native `Date` and format and localize with `Intl` (`DateTimeFormat`, `Locale` week info). Mantine uses `dayjs` instead. Most of what dayjs gives Mantine is locale formatting, which `Intl` now covers without shipping per-locale data, and dropping it keeps the package free of a date-library dependency.

## Considered Options

- **dayjs** (Mantine's choice): needs a locale file imported per language, and its API would leak into our props.
- **date-fns:** tree-shakes well, but still ships locale data and is a dependency we don't need.
- **Temporal:** the right long-term model, but it would need a polyfill until browsers support it everywhere. We can revisit once it ships natively.
