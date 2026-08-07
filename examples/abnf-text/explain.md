`NR` is the built-in number token, `[ … ]` is optional, and `add` refers to
itself to take a whole chain — so `val` wraps an addition of any length.

Bare ABNF is not a program, so it is wrapped here in the smallest thing that
runs it: compile the grammar, then parse. With no actions attached it only
recognises, which is why the output records acceptance rather than a value.
