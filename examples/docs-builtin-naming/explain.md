A ref is a string beginning with `@`, and a trailing `$` marks it as an engine
builtin — so `'@value$'` is an action the engine supplies rather than one you
wrote.

The `$` namespace is reserved: installing a grammar whose own ref map contains a
`$` is an error, so a builtin can never be shadowed by something a grammar
brought with it.
