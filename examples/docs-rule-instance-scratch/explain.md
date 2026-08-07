Two scratch bags, differing in exactly one way. `u` belongs to the one rule
instance, so `item` never sees what `top` put there. `k` propagates to every
rule pushed or repeated below, so `item` does see that.

Use `u` for something a rule needs between its own open and close phases, and
`k` for configuration a whole subtree should read.
