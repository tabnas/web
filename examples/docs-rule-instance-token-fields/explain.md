Subscribing to the lexer prints each token's name, source text, resolved value
and 1-based row and column. Note the pairs: `#ST` has `src` `"a"` with the
quotes and `val` `a` without; `#NR` has `src` `42` the string and `val` 42 the
number.

Picking the wrong one of `src` and `val` is a common bug, and the fastest way to
settle it is to look.
