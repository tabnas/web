An alternate's `a` accepts a list of actions, run in the order given.
`['@reset$', '@object$']` is the idiom for a rule that must not inherit its
parent's node: clear the seeded value first, then build a fresh one.

Reversing the pair proves the order is real — resetting after building discards
the object again and the parse yields nothing.
