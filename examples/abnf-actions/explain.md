The grammar is plain RFC 5234 ABNF — nothing tabnas-specific is added to it.
`val = add` makes `val` the entry rule, `add = NR [ PL add ]` reads a number
then optionally another `+ …` chain, and `PL = "+"` names the operator token.

Behaviour binds **out of band**, through names the compiler already assigns:
`@val:o:add` is the `val` rule's open-phase alternate that pushes `add`, and
`@add:o:NR` is `add`'s open-phase alternate matching a number token. Run
`tabnas-abnf --marks` to list a grammar's marks rather than guessing them.

Because the tail self-reference `[ PL add ]` compiles to a close-phase repeat,
`r.parent` is `val` for every repetition — so the running total accumulates on
`val`'s node, which is what `parse` returns.

The two versions differ in one detail: Go's number tokens carry `float64`,
where TypeScript carries a JS number, so the Go version asserts `float64` and
converts once at the end.
