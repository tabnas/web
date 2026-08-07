import { Tabnas } from '@tabnas/parser'

const tn = new Tabnas()
tn.options({
  fixed: { token: { '#OP': '(', '#CP': ')' } },
  rule: { start: 'val' },
})

const OP = tn.token('#OP')
const setNumber = (r: any) => { r.node = r.o0.val }

// `c` is checked when an alternate's tokens match. If it returns false the
// alternate is skipped and the next one is tried.
tn.rule('val', (rs: any) => rs
  .open([{ s: '#OP', p: 'val' }, { s: '#NR', a: setNumber }])
  .close([
    // Only a val that opened on '(' may consume ')'.
    { s: '#CP', c: (r: any) => OP === r.o0?.tin, a: (r: any) => { r.node = [r.child.node] } },
    {},
  ]))

for (const src of ['1', '(1)', '((1))']) {
  console.log(src.padEnd(6), '=>', JSON.stringify(tn.parse(src)))
}
