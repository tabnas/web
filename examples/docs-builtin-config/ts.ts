import { Tabnas } from '@tabnas/parser'

// Config for a builtin rides on the alternate's `k`, keyed by the builtin name.
// `from` is which open token to read (default 0), `slot` is the `r.u` key to
// store under (default 'key').
function build(keyConfig?: Record<string, any>) {
  const tn = new Tabnas()
  tn.grammar({
    options: {
      fixed: { token: { '#EQ': '=' } },
      rule: { start: 'pair' },
    },
    rule: {
      pair: {
        open: [{
          s: ['#TX', '#EQ'],
          p: 'val',
          a: ['@object$', '@key$'],
          ...(keyConfig ? { k: keyConfig } : {}),
        }],
        close: [{ a: '@setval$' }],
      },
      val: {
        open: [{ s: '#NR', a: '@value$' }],
        close: [{}],
      },
    },
  })
  return tn
}

// Spelling the defaults out changes nothing — which is why a grammar that
// relies on them never mentions them.
console.log('config omitted:  ', JSON.stringify(build().parse('port = 8080')))
console.log('defaults spelled:', JSON.stringify(
  build({ key$: { from: 0, slot: 'key' } }).parse('port = 8080')))
