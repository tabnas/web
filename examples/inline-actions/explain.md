Same grammar, same machine as step 3 — the actions are just written straight
onto the alternates as `a`. Because `r` repeats `add` at the same stack depth
rather than nesting it, every `add` shares one parent, so the accumulator is a
single number that rides on the parse and `parse` returns it directly.

The two versions differ in how the table is typed: Go's `GrammarSpec` takes the
action function as-is, where TypeScript's declarative type only sanctions
`'@ref'` strings, so the rule table needs a cast. Go's number tokens also carry
`float64` rather than a JS number.
