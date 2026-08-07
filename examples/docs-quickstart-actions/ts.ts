import { Tabnas } from '@tabnas/parser'
import { abnf } from '@tabnas/abnf'

const tn = new Tabnas({ plugins: [abnf] })
tn.abnf(`
  val = add
  add = NR [ PL add ]
  PL  = "+"
`, {
  actions: {
    // `val` holds the running total.
    '@val:o:add': (r: any) => { r.node.value = 0 },

    // Each number adds to it.
    '@add:o:NR': (r: any) => { r.parent.node.value += r.o[0].val },
  },
})

// The total rides on the parse, not on an outer variable — so re-parsing the
// same input gives the same answer, and the instance carries no state.
for (const src of ['1+2+3', '12+3+45', '1+2+3']) {
  console.log(src.padEnd(8), '=>', (tn.parse(src) as any).value)
}
