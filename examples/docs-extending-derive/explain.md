Derive, don't mutate. `make()` returns a fresh instance that starts out
identical, so anything you add or remove afterwards affects only your copy and
never the parser other code is using.

That isolation is what makes extension safe enough to be the default way of
building with tabnas.
