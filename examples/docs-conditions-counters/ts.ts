import { Tabnas } from '@tabnas/parser'

let seen = 0

// `n` on an alternate sets or increments a named counter, and counters
// propagate to pushed and repeated rules. Setting 0 RESETS; any other number
// adds.
function build(step: number) {
  const tn = new Tabnas()
  tn.options({
    fixed: { token: { '#OP': '(', '#CP': ')' } },
    rule: { start: 'val' },
  })
  tn.rule('val', (rs: any) => rs
    .open([
      { s: '#OP', p: 'val', n: { depth: step } },
      { s: '#NR', a: (r: any) => { seen = r.n.depth ?? 0 } },
    ])
    .close([{ s: '#CP' }, {}]))
  return tn
}

function depthAt(step: number, src: string) {
  build(step).parse(src)
  return seen
}

for (const src of ['1', '(1)', '((1))']) {
  console.log(`n:{depth:1}  ${src.padEnd(6)} depth at the number =`, depthAt(1, src))
}
console.log('n:{depth:0}  ((1))  depth at the number =', depthAt(0, '((1))'))
