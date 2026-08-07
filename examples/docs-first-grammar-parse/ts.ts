import { Tabnas } from '@tabnas/parser'
import { abnf } from '@tabnas/abnf'

const tn = new Tabnas({ plugins: [abnf] })

tn.abnf(`
  list  = item *( COMMA item )
  item  = 1*ALPHA
  COMMA = ","
`)

// Whatever the grammar, a parse returns the same { rule, src, kids } node —
// which is why a walker written once works for every language you define.
for (const src of ['a', 'a,bc,def']) {
  const n = tn.parse(src) as any
  console.log(`rule=${n.rule} src=${JSON.stringify(n.src)}`)
}
