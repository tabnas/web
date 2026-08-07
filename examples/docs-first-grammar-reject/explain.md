Recognising good input proves very little. If `a,,b` had parsed, the
`*( COMMA item )` group would be matching a comma without requiring an item
after it — and the grammar would look fine while being wrong.

A leading or trailing comma is refused for the same reason. Always run the
malformed cases; they are what tells a working grammar from a permissive one.
