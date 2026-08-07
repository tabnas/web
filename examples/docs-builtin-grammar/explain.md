Five rules and seven builtin names build real JSON-shaped values with no code in
the grammar at all. The trick is the seeded node: a pushed rule inherits its
parent's `r.node`, so `@setval$` writing a property from inside `pair` is
writing into the very object `val` returns.

`@key$` stores the key on `r.u`, the non-propagating bag, so a nested pair
cannot clobber an outer one's key.

TypeScript writes the spec as an object literal; Go writes the same table as a
`GrammarSpec` struct, since Go has no untyped object literal.
