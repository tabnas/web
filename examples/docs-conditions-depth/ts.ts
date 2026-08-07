import { Tabnas } from '@tabnas/parser'
import { json } from '@tabnas/json'

const MAX = 3
const tn = new Tabnas({ plugins: [json] })
tn.options({ error: { too_deep: 'nested deeper than {max} levels' } })

// Nesting is allowed while `depth` is below the limit. Past it neither push
// alternate matches, and the unconditional guard behind them is reached.
tn.rule('val', (rs: any) => rs.open(
  [{ s: [['#OB', '#OS']], b: 1, e: (r: any) => r.o0.bad('too_deep', { max: MAX }) }],
  {
    custom: (alts: any[]) => {
      const guard = alts.shift()          // the alternate just prepended
      alts[0].n = alts[1].n = { depth: 1 }               // map and list push
      alts[0].c = alts[1].c = { 'n.depth': { $lt: MAX } }
      alts.splice(2, 0, guard)            // guard sits behind them
      return alts
    },
  },
))

// Order matters: alternates are tried in order and the first match wins, so a
// guard placed first would claim the token before the pushes are considered.
for (const src of [
  '{"a":1}', '{"a":{"b":{"c":1}}}', '[[[1]]]',
  '{"a":{"b":{"c":{"d":1}}}}', '[[[[1]]]]',
]) {
  try {
    console.log(src.padEnd(26), '=>', JSON.stringify(tn.parse(src)))
  } catch (e: any) {
    console.log(src.padEnd(26), '=>', e.code)
  }
}
