import { Tabnas } from '@tabnas/parser'

const tn = new Tabnas()

// No functions anywhere: the only action is a builtin, named by string.
tn.grammar({
  rule: {
    val: {
      open: [{ s: '#NR', a: '@value$' }],
      close: [{}],
    },
  },
})

for (const src of ['42', '3.5', '-7']) {
  console.log(src, '=>', tn.parse(src))
}
