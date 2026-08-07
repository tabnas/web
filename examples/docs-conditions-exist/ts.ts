import { Tabnas } from '@tabnas/parser'

let existed = false
let isZero = false

// `eq('k', 0)` is true both for a counter set to 0 and for one never set.
// `exist` is the only way to tell those two apart.
function build(step: number) {
  const tn = new Tabnas()
  tn.options({
    fixed: { token: { '#OP': '(', '#CP': ')' } },
    rule: { start: 'val' },
  })
  tn.rule('val', (rs: any) => rs
    .open([
      { s: '#OP', p: 'val', n: { depth: step } },
      { s: '#NR', a: (r: any) => { existed = r.exist('depth'); isZero = r.eq('depth', 0) } },
    ])
    .close([{ s: '#CP' }, {}]))
  return tn
}

const cases: [string, number, string][] = [
  ['never set', 1, '1'],
  ['set to 0 ', 0, '(1)'],
  ['counted 1', 1, '(1)'],
]
for (const [label, step, src] of cases) {
  build(step).parse(src)
  console.log(label, ' exist:', String(existed).padEnd(5), ' eq(depth,0):', isZero)
}
