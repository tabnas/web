A depth limit done properly: the two push alternates carry the counter and the
`$lt` guard, and an unconditional alternate that raises `too_deep` sits
**behind** them. Alternates are tried in order, so a guard placed first would
claim the opening bracket before either push was ever considered.

Because an unset counter reads as `0`, the first bracket passes `0 < 3` and
nesting proceeds; the fourth finds `3 < 3` false and falls through to the guard.

Go reaches the same alternates through `ModifyOpen` and reads the failure code
off a returned `*TabnasError` rather than catching a throw.
