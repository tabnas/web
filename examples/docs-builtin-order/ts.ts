import { Tabnas } from '@tabnas/parser'

// `a` takes an array, run in order. `['@reset$', '@object$']` is the idiom for
// a rule that must not inherit its parent's node: clear first, then build.
function build(actions: string[]) {
  const tn = new Tabnas()
  tn.grammar({
    options: { rule: { start: 'val' } },
    rule: {
      val: {
        open: [
          { s: '#OB', p: 'map', b: 1, a: actions as any },
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
    },
  })
  return tn
}

// Order matters: reset after building throws the object away again.
for (const actions of [['@reset$', '@object$'], ['@object$', '@reset$']]) {
  const out = build(actions).parse('{a:1}')
  console.log(actions.join(','), '=>', undefined === out ? '(no value)' : JSON.stringify(out))
}
