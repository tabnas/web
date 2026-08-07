Actions written straight onto the alternate as `a`. Two one-line functions
suffice because `r` **repeats** `add` at the same stack depth rather than
pushing it, so every `add` shares one parent and the total lives in one place.

The cost is that the grammar is now code: it can no longer be serialised,
printed back as ABNF, or safely accepted from anywhere you do not trust.
