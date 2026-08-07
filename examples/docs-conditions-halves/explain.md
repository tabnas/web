The asymmetry is invisible in the syntax, so here it is measured. `$eq` on a
path that does not resolve fails closed. A counter compares as a number from
zero, so `$gte: 99` is a real comparison that fails and `$lt: 1` is one that
passes. An ordered op on a **non**-counter path that does not resolve fails
open.

Use `$exist` when you mean "only if this was explicitly set".

TypeScript writes the operators as an object; Go passes the same comparison as a
`CondOp` value — `tabnas.CGte(99)` — which is data, not a closure, so the
grammar still serialises.
