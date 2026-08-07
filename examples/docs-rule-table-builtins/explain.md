`@value$` is an engine builtin referenced by name, so the grammar is a JSON
document with no code in it — here it is loaded from a string to prove the
point. It resolves the matched token into `r.node`, which is what `parse`
returns.

Go has no `JSON.parse`, so it registers a text parser backed by
`encoding/json` and calls `GrammarText`.
