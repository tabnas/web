The grammar is a table: rules, each with an open and a close phase, each phase a
list of alternates tried in order. Subscribing to rule events prints the machine
walking it — `val` **pushes** `add` (depth 0 to 1), then each `+` **repeats**
`add` at depth 1 rather than nesting.

That flatness is what lets an accumulator live in one place: every repetition
shares the one `val` parent.
