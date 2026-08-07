Two rules, and four fields of the rule instance between them: `r.o0` is the
token that opened the rule, `r.child` the instance that just closed beneath it,
and `r.node` the value each rule carries — the start rule's is what `parse`
returns.

`r.child` is only meaningful in the close phase, so `pair` assembles its result
there rather than on the way down.

TypeScript names tokens by string in the alternate; Go looks their numeric ids
up once with `j.Token` and matches on those.
