`p` pushes a rule, `s` matches tokens, `r` repeats the rule at the same depth,
and `{}` is the alternate that ends it. This is the compiled form of the ABNF
in step 1, and it recognises exactly the same inputs — but with no actions it
produces nothing, which is why the output only records acceptance.

TypeScript reads the literal with the built-in `JSON.parse`; Go has no
equivalent, so it registers a text parser once and then hands the engine the
same string.
