import { Tabnas } from '@tabnas/parser'
import { abnf } from '@tabnas/abnf'

const tn = new Tabnas({ plugins: [abnf] })

tn.abnf(`
  val = add
  add = NR [ PL add ]
  PL  = "+"
`, {
  actions: {
    '@val:o:add': (r: any) => { r.node.value = 0 },
    '@add:o:NR': (r: any) => { r.parent.node.value += r.o[0].val },
  },
})

console.log(tn.parse('1+2+3').value)
console.log(tn.parse('12+3+45').value)
