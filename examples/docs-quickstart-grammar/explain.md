Three lines of ABNF install a grammar. Listing the compiled rules shows what the
compiler decided: `val` and `add` are rules, `PL` became a fixed token rather
than a rule, and a `__start__` wrapper was added to require end-of-source.

There is no code generation — the rule table is data, so you can ask a live
instance what it holds.
