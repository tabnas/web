Recognising is not computing. Two actions, bound by alternate mark, turn the
same grammar into an adding machine: `@val:o:add` seeds the total,
`@add:o:NR` adds each number to `r.parent.node`.

Because `add` repeats at the same depth, `r.parent` is the one `val` node for
every number — and since the total lives on the parse rather than in an outer
variable, parsing the same input twice gives the same answer.
