import { Tabnas } from '@tabnas/parser'

const tn = new Tabnas()
tn.options({
  fixed: { token: { '#EQ': '=' } },
  rule: { start: 'pair' },
})

// `r.o0` is the token that opened the rule; `r.child` is the rule that just
// closed beneath it — which is why the assembly happens in the close phase.
tn.rule('pair', (rs: any) => rs
  .open([{ s: ['#TX', '#EQ'], p: 'val' }])
  .close([{ a: (r: any) => { r.node = { key: r.o0.src, value: r.child.node } } }]))

tn.rule('val', (rs: any) => rs.open([
  { s: '#NR', a: (r: any) => { r.node = r.o0.val } },
]))

const out: any = tn.parse('port = 8080')
console.log(`key=${out.key} value=${out.value}`)
