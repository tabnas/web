Pruning a rule narrows a language: drop `list` and the dialect keeps objects but
no longer parses arrays. Subtracting is how a stricter grammar is built from a
looser one — the JSON grammar is partly jsonic with the relaxations removed.

TypeScript spells the removal as `rule(name, null)`; Go passes a nil entry in a
`GrammarSpec`, which means the same thing.
