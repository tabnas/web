An alternate with a token sequence collects every token it matched. `r.o` is the
list, `r.o0` and `r.o1` are shorthand for the first two, and `r.os` is the
count. The close phase fills `r.c` the same way.

`r.o0` is the one you reach for most: it is the token that decided which
alternate you are in, and so the right thing to point a parse error at.
