import { Tabnas } from '@tabnas/parser'
import { abnf } from '@tabnas/abnf'

const tn = new Tabnas({ plugins: [abnf] })
tn.abnf(`
  val = add
  add = NR [ PL add ]
  PL  = "+"
`)

// What the ABNF compiled to: `val` and `add` are rules, `PL` became a token,
// and the compiler added a `__start__` wrapper that consumes end-of-source.
console.log('rules:', Object.keys(tn.rule() as object).sort().join(' '))
