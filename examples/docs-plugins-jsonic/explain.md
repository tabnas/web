The starting point: a relaxed JSON that already reads unquoted keys, nested
objects and arrays. Composition beats writing a parser, so the question is
always what already parses something close.

The second line is the gap this tutorial closes — `1+2` comes back as a string,
because jsonic has no notion of arithmetic.
