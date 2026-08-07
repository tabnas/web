Every tree-building grammar produces the same node shape: the rule that
matched, the source text it covered, and its children. Nesting is just `kids`
holding more of the same.

TypeScript expresses it as a structural type; Go as a struct with JSON tags, so
the same tree serialises identically from either runtime.
