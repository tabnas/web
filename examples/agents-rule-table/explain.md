The table is the whole grammar: `val` pushes `add`, `add` matches a number and
then either repeats itself after a `+` or stops at the empty alternate `{}`.
Nothing here is code, so it can be validated, diffed and printed before it runs.

The loop is the point. A grammar that accepts `1+2+3` proves little on its own —
`1+` and `+1` have to be **rejected** too, and a phase with no matching alternate
is exactly what rejects them.

TypeScript signals a parse failure by throwing; Go returns an `error` from
`Parse`. Same verdict either way.
