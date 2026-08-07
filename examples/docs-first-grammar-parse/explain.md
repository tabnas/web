The grammar recognises the input and returns the same `{ rule, src, kids }` node
whether the list has one item or three. `rule` is what matched and `src` is the
text it covered, so a walker written once applies to every language you define.

Nothing here is grammar-specific: the two runtimes read the identical fields off
the identical shape.
