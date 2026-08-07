Every rule activation is visible: name, phase (`o` open, `c` close) and stack
depth. Two `add` instances at depth 2 is the tail self-reference compiling to a
same-depth repeat; the step from `val` to `add` is a push.

`__start__` is the wrapper the ABNF compiler adds to require end-of-source — a
hand-written rule table has no such check unless you write one.
