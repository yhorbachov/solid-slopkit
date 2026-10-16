# i18n (`@solid-slopkit/i18n`)

Translations live next to the code that uses them, the way CSS modules do, and are read as plain typed objects. Terms shared by every package live in [CONTEXT-MAP.md](../../CONTEXT-MAP.md).

## Language

**Translation file**:
A file with the `.i18n.jsonc` suffix holding the Messages of every locale for one component, or for a set of shared strings. Imported like a module; the import is the live, typed Messages for the Active locale. A shared translation file is an ordinary translation file imported from several places, not a special kind.
_Avoid_: dictionary, bundle, resource file, locale file

**Message**:
One translated string, addressed by a key in a Translation file (`translations.title`). A Message with parameters is read as a typed function (`translations.greeting({ name })`).
_Avoid_: string, label, key (the key only addresses a Message)

**Default locale**:
The locale whose Messages define the keys of every Translation file, and the fallback for a Message missing from another locale.
_Avoid_: base locale, source language

**Active locale**:
The locale the nearest `I18nProvider` holds. Every Message read resolves against it.
_Avoid_: current language, lang
