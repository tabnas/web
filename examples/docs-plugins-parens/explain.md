Parentheses override precedence and survive into the tree as a node of their
own, carrying exactly one term. That is what lets an evaluator spot them and
simply descend, which is the whole of the paren case in a walker.

The shape is abbreviated to each operator's source text; the real first element
is an operator node.
