The middle two rows are the point: a counter never set and a counter reset to
`0` compare identically, so `eq('depth', 0)` cannot tell them apart. `exist`
can, and it is the only thing that can.

Reach for it whenever you mean "only if this was explicitly set" rather than
"whatever it counts to".
