import { Tabnas } from '@tabnas/parser'

// A JSON-shaped parser with not one function in it: every action is a builtin
// named by string. Search this object for the word `function` — there isn't one.
const spec = {
  options: { rule: { start: 'val' } },
  rule: {
    val: {
      open: [
        { s: '#OB', p: 'map', b: 1, a: '@object$' },
        { s: '#OS', p: 'list', b: 1, a: '@array$' },
        { s: '#VAL', a: '@value$' },
      ],
      close: [{}],
    },
    map: {
      open: [{ s: ['#OB', '#CB'], b: 1 }, { s: '#OB', p: 'pair' }],
      close: [{ s: '#CB' }],
    },
    pair: {
      open: [{ s: ['#TX', '#CL'], p: 'val', a: '@key$' }],
      close: [
        { s: '#CA', r: 'pair', a: '@setval$' },
        { s: '#CB', b: 1, a: '@setval$' },
      ],
    },
    list: {
      open: [{ s: ['#OS', '#CS'], b: 1 }, { s: '#OS', p: 'elem' }],
      close: [{ s: '#CS' }],
    },
    elem: {
      open: [{ p: 'val' }],
      close: [
        { s: '#CA', r: 'elem', a: '@push$' },
        { s: '#CS', b: 1, a: '@push$' },
      ],
    },
  },
}

const tn = new Tabnas()
// Cast: the declarative GrammarSpec type wants '@…' literal types, which a
// separately declared object widens to plain strings.
tn.grammar(spec as any)

for (const src of ['42', '"hi"', '{a:1}', '{a:1,b:2}', '{}', '[]']) {
  console.log(src.padEnd(9), '=>', JSON.stringify(tn.parse(src)))
}
