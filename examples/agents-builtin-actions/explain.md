`@value$` is an engine builtin, merged into the ref map when the grammar loads,
so it is referenced by **name** rather than supplied as a function. The whole
grammar is therefore data — safe to serialise, store, and hand to someone else.

`@value$` resolves the matched scalar token onto the node, and the node of the
start rule is what `parse` returns. The token is already typed: a number comes
back as a number, not the source text.

Go carries that number as a `float64` where TypeScript uses a JS number; both
print the same here because neither prints a trailing `.0`.
