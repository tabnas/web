Several keys in one `c` are ANDed: the alternate applies only when every one
holds. Drop either half — the wrong mode, or a counter that has not reached one
— and the guarded alternate is skipped and the next one is tried.

`u` survives from a rule's open phase into its close phase, which is why the
mode set on the way down is readable on the way back up.

TypeScript takes a bare value as `$eq`; Go spells the same comparison out as a
`CondOp` — `tabnas.CEq("strict")`.
