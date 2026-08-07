`n` on an alternate sets or increments a named counter, and counters propagate
to pushed and repeated rules — so a count made at the top is visible all the way
down.

The last line is the trap: setting `0` **resets** rather than adding nothing, so
two levels of nesting still report `0`. Reading `n: { pk: 0 }` in the JSON
grammar as a no-op will mislead you.
