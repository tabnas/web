One ABNF line compiles to a working parser: `greet` matches either literal and
yields the uniform `{ rule, src, kids }` node. Anything else is a parse error,
which is the half of a grammar worth checking.

TypeScript throws on a bad parse; Go returns an `error` from `Parse` — the same
outcome, reported the way each language reports failure.
