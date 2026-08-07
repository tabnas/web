import { Jsonic } from '@tabnas/jsonic'

// `make()` produces a fresh instance. Changes to it leave the original alone,
// so other code using the base parser is unaffected.
const mine = Jsonic.make()

console.log('derived  ', JSON.stringify(mine('a:1')))    // the derived instance
console.log('original ', JSON.stringify(Jsonic('a:1')))  // still the original
