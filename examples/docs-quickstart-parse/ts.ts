import { Tabnas } from '@tabnas/parser'
import { abnf } from '@tabnas/abnf'

const tn = new Tabnas({ plugins: [abnf] })
tn.abnf(`
  val = add
  add = NR [ PL add ]
  PL  = "+"
`)

// Every parse has the same { rule, src, kids } shape, so one walker prints any
// tree from any grammar.
function show(n: any, depth = 0) {
  console.log('  '.repeat(depth) + n.rule + ' ' + JSON.stringify(n.src))
  for (const kid of n.kids) show(kid, depth + 1)
}

show(tn.parse('1+2'))
