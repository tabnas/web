Three rules and the language exists. `ALPHA` is one of the RFC 5234 core rules,
included automatically because the grammar refers to it, and `COMMA` is declared
as a rule so the comma becomes a named token rather than an anonymous literal.

Asking the live instance for its rules also shows the cost of sugar: `*( … )`
and `1*` desugar into generated rules, so the runtime rule names are not only
the ones you wrote.
