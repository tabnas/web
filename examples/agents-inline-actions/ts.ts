import { Tabnas } from '@tabnas/parser'

const tn = new Tabnas({
  fixed: { token: { '#PL': '+' } },
  rule: { start: 'val' },
})

// Functions written straight onto the alternates: the grammar is now code.
tn.rule('val', (rs: any) =>
  rs
    .open([{ p: 'add', a: (r: any) => { r.node = 0 } }])
    .close([{}]))

tn.rule('add', (rs: any) =>
  rs
    .open([{ s: '#NR', a: (r: any) => { r.parent.node += r.o[0].val } }])
    .close([{ s: '#PL', r: 'add' }, {}]))

for (const src of ['1', '1+2+3', '12+3+45']) {
  console.log(src, '=>', tn.parse(src))
}
