`@value$` is an action referenced by name, so the grammar contains no code and
stays a JSON document. That is the whole point of the builtins: the same text
installs anywhere and parses the same way.

Prefer this form when a grammar has to be stored, diffed, or accepted from
somewhere you do not trust.
