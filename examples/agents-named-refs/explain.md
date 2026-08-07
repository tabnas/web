Both kinds of name are here. `@val:ao` is a **rule-phase hook** — after `val`
opens — and `@add:o:NR` is an **alternate mark**, the open-phase alternate of
`add` that matched a number. The grammar text itself stays free of code.

Because the tail self-reference `[ PL add ]` compiles to a same-depth repeat,
`r.parent` is `val` for every term, so one accumulator on one node collects them
all. Results live on the node, never in a variable outside the parse, so the
grammar stays reusable.

Mark names come from the compiler, not from you — run `tabnas-abnf --marks` to
list them rather than guessing.

Go's number tokens carry `float64` and its nodes are `map[string]any`, so the
Go version asserts types where TypeScript just reads properties.
