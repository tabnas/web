import { Tabnas } from '@tabnas/parser'
import { abnf } from '@tabnas/abnf'

const tn = new Tabnas({ plugins: [abnf] })
tn.abnf(`
  val = add
  add = NR [ PL add ]
  PL  = "+"
`)

// You do not have to guess at any of this: subscribe and watch.
// name~state@depth — two `add` instances at the same depth is a repeat,
// increasing depth is a push.
const trace: string[] = []
tn.sub({ rule: (r: any) => trace.push(`${r.name}~${r.state}@${r.d}`) })
tn.parse('1+2')
console.log(trace.join(' '))
