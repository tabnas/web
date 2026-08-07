import { Tabnas } from '@tabnas/parser'
import { abnf } from '@tabnas/abnf'

// Plain RFC 5234 ABNF — this is the whole grammar.
const GRAMMAR = `
  val = add
  add = NR [ PL add ]
  PL  = "+"
`

const tn = new Tabnas({ plugins: [abnf] })
tn.abnf(GRAMMAR)

// Compiled, it recognises an addition chain and refuses anything else.
for (const src of ['1+2+3', '12+3+45', '1+*']) {
  let ok = true
  try { tn.parse(src) } catch { ok = false }
  console.log(src.padEnd(8), ok ? 'accepted' : 'rejected')
}
