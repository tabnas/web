The object form of `c` is a check against a dot-path on the rule instance —
`n.depth` is the counter, `u.mode` your own scratch value, `o0.tin` the opening
token. There is no closure, so the grammar remains data: serialisable, diffable,
and checkable before you run it.

Use it for anything that is a comparison against rule state, which is most
guards. Anything involving two paths, arithmetic, or a call into your own code
needs a function — and the grammar becomes code at that point.
