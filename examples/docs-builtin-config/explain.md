A builtin's configuration rides on the alternate's `k`, keyed by the builtin's
name: `k: { key$: { from: 0, slot: 'key' } }`. `from` picks which open token to
read and `slot` names the `r.u` key to store it under.

Both values here are the defaults, so spelling them out changes nothing — which
is why a grammar that relies on them never mentions them.
