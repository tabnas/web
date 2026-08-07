The plugin did the parsing, so evaluation is ten lines: a plain value returns
itself, a paren node has one term to descend into, and everything else looks its
operator up and applies it. Precedence and associativity are already in the tree
— `7-1-2` is 4, not 8.

TypeScript reads `op.paren` and `op.src` off the operator node; Go walks the
same tree after `Simplify` has reduced each operator to its source string.
