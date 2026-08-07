The action is written straight onto the alternate as `a`. This is the most
direct of the three ways to attach behaviour, and the least shareable: the
grammar is code now, so it can no longer be serialised or safely handed on.

`r` is the rule instance, `r.node` the value it carries, `r.o` the tokens
matched in the open phase — so `r.o[0].val` is the first token's value, already
a number — and `r.parent` the pushing rule. `close: [{ s: '#PL', r: 'add' }, {}]`
repeats at the same depth, so every term sees the same `r.parent`.

Go declares the token Tins up front (`j.Token("#NR")`) where TypeScript names
them as `'#NR'` strings, and its numbers are `float64`.
