import { Jsonic } from '@tabnas/jsonic'

// Before changing a grammar, look at it. `rule()` with no arguments lists the
// rules on an instance — possible because the grammar is still data at runtime
// rather than generated code.
const rules = Object.keys(Jsonic.make().rule())

console.log(rules.sort().join(' '))
console.log('rule count:', rules.length)
