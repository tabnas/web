Adding a plugin is the common case of extension. Base jsonic reads `1+2*3` as a
string; with `Expr` layered on, the same input becomes an expression tree with
precedence already handled — and the base parser is untouched.

TypeScript abbreviates the op nodes with a four-line walker; the Go port ships
`Simplify`, which does the same thing.
