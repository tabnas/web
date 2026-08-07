Both `val` alternates look the same to the lexer at the closing bracket, so the
difference has to come from state. `c` is checked once an alternate's tokens
match: only a `val` that opened on `(` may consume `)`, and a bare number falls
through to the empty alternate.

Everything on the rule instance is available inside `c` — `r.o0`, `r.parent`,
`r.child`, `r.n`, `r.u`.
