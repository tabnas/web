A counter that was never incremented has counted nothing, so it compares as
`0`: below a limit, not past one, and equal to zero. Exactly one of `<`, `=`,
`>` holds, so a guard means what it says wherever you put it.

`exist` is the one question the comparisons cannot answer — a counter set to `0`
and one never set compare identically.
