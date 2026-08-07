import { Tabnas } from '@tabnas/parser'
import { abnf } from '@tabnas/abnf'

const tn = new Tabnas({ plugins: [abnf] })

tn.abnf(`
  list  = item *( COMMA item )
  item  = 1*ALPHA
  COMMA = ","
`)

// The step people skip. A grammar that accepts everything looks exactly like a
// grammar that works, so try the malformed input too.
for (const src of ['a', 'a,bc,def', 'a,,b', ',a', 'a,']) {
  let verdict = 'accepted'
  try { tn.parse(src) } catch { verdict = 'rejected' }
  console.log(JSON.stringify(src).padEnd(11), verdict)
}
