Actions bind to alternate marks — `@val:o:add` is `val`'s open alternate that
pushes `add`, `@add:o:NR` is `add`'s open alternate on a number token. The ABNF
text itself stays valid RFC 5234.

The tail self-reference `[ PL add ]` compiles to a same-depth repeat, so
`r.parent` is `val` for every number and the total accumulates in one node.

The one real difference: a number token's `val` is a JS number in TypeScript and
a `float64` in Go, so the Go version asserts the type before adding.
