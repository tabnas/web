A builtin-only grammar is data, so it can be stored and installed again
somewhere else and parse identically. Take the serialised copy **before**
installing.

That ordering matters in TypeScript, where `grammar()` resolves the `@…$` ref
strings in place: serialise afterwards and you get a spec that still installs,
still parses, and silently returns nothing. Go's `GrammarText` reads the text
and leaves your value alone, so the trap does not arise there.
