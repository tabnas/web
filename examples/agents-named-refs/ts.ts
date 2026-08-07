import { Tabnas } from '@tabnas/parser'
import { abnf } from '@tabnas/abnf'

const tn = new Tabnas({ plugins: [abnf] })

// The grammar stays declarative; the code lives out here, bound by name.
tn.abnf(`
  val = add
  add = NR [ PL add ]
  PL  = "+"
`, {
  actions: {
    // Rule-phase hook: after 'val' opens, seed the accumulator on its node.
    '@val:ao': (r: any) => { r.node.value = 0; r.node.count = 0 },

    // Alternate mark: each number adds to it.
    '@add:o:NR': (r: any) => { r.parent.node.value += r.o[0].val; r.parent.node.count++ },
  },
})

for (const src of ['1', '1+2+3', '12+3+45']) {
  const node = tn.parse(src)
  console.log(`${src} => total ${node.value}, terms ${node.count}`)
}
