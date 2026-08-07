import { Tabnas } from '@tabnas/parser'

const spec = {
  options: {
    fixed: { token: { '#EQ': '=' } },
    rule: { start: 'pair' },
  },
  rule: {
    pair: {
      open: [{ s: '#TX #EQ', p: 'val', a: ['@object$', '@key$'] }],
      close: [{ a: '@setval$' }],
    },
    val: {
      open: [{ s: '#NR', a: '@value$' }],
      close: [{}],
    },
  },
}

// Serialise BEFORE installing. `grammar()` resolves the '@…$' ref strings in
// place, so afterwards those fields hold functions and the spec no longer
// round-trips — the copy would install cleanly and lose every action.
const wire = JSON.stringify(spec)

const tn = new Tabnas()
// Cast: the declarative GrammarSpec type wants '@…' literal types, which a
// separately declared object widens to plain strings.
tn.grammar(spec as any)
console.log('here      =>', JSON.stringify(tn.parse('port = 8080')))

// Later, or elsewhere, or in another process.
const elsewhere = new Tabnas()
elsewhere.grammar(JSON.parse(wire))
console.log('elsewhere =>', JSON.stringify(elsewhere.parse('port = 8080')))
