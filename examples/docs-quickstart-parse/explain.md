The grammar recognises `1+2` and builds a tree. Both `add` nodes are siblings,
not nested: the compiler turns the tail self-reference `[ PL add ]` into a
same-depth repeat. `PL` compiled to a token, so the `+` never appears as a kid.

The walker is four lines because the node shape never varies — the same
function prints a tree from any grammar in either runtime.
