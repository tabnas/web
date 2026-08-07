import { Tabnas } from '@tabnas/parser'

const tn = new Tabnas()
tn.options({
  fixed: { token: { '#EQ': '=' } },
  rule: { start: 'pair' },
})

// The open phase collects its matched tokens into `r.o`; `r.o0` and `r.o1` are
// shorthand for the first two, and `r.os` is how many matched.
tn.rule('pair', (rs: any) => rs
  .open([{ s: ['#TX', '#EQ'], p: 'val' }])
  .close([{ a: (r: any) => {
    console.log('open tokens:', r.os)
    console.log('first: ', JSON.stringify(r.o0.src))
    console.log('second:', JSON.stringify(r.o1.src))
    console.log('all:   ', r.o.map((t: any) => t.src).join(','))
  } }]))

tn.rule('val', (rs: any) => rs.open([{ s: '#NR' }]))

tn.parse('port = 8080')
