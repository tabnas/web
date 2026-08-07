import { Tabnas } from '@tabnas/parser'
import { abnf } from '@tabnas/abnf'

const tn = new Tabnas({ plugins: [abnf] })

// The ABNF text stays valid RFC 5234; the behaviour binds through names the
// compiler assigns.
tn.abnf(`
  val = add
  add = NR [ PL add ]
  PL  = "+"
`, {
  actions: {
    // Alternate marks: @<rule>:<phase>:<mark>.
    '@val:o:add': (r: any) => { r.node.value = 0 },
    '@add:o:NR': (r: any) => { r.parent.node.value += r.o[0].val },

    // A rule-phase hook: @<rule>:ac is after-close.
    '@val:ac': (r: any) => { console.log('val closed with', r.node.value) },
  },
})

for (const src of ['1+2+3', '12+3+45']) {
  console.log(src.padEnd(7), '=>', (tn.parse(src) as any).value)
}
