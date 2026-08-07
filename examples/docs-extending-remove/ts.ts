import { Jsonic } from '@tabnas/jsonic'

// Passing `null` prunes a rule. This is how a stricter dialect is built from a
// looser one.
const strict = Jsonic.make()
strict.rule('list', null)

console.log('rules left:', Object.keys(strict.rule()).sort().join(' '))

for (const src of ['{a:1}', '[1,2]']) {
  let verdict = 'accepted'
  try { strict(src) } catch { verdict = 'rejected' }
  console.log(src.padEnd(7), verdict)
}
